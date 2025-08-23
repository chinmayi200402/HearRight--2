export class ToneEngine {
  private audioContext: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private isPlaying = false
  private warbleEnabled = false
  private warbleLFO: OscillatorNode | null = null
  private warbleGain: GainNode | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioContext()
    }
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Resume context if suspended (required by some browsers)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }
    } catch (error) {
      console.error("Failed to initialize audio context:", error)
    }
  }

  async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initAudioContext()
    }
    if (this.audioContext?.state === "suspended") {
      await this.audioContext.resume()
    }
  }

  async playTone(
    frequency: number,
    durationMs: number,
    volumeDb: number,
    ear: "Left" | "Right" | "Both" = "Both",
    warble = false,
  ): Promise<void> {
    await this.ensureAudioContext()

    if (!this.audioContext) {
      throw new Error("Audio context not available")
    }

    this.stopTone()

    // Create oscillator for main tone
    this.oscillator = this.audioContext.createOscillator()
    this.gainNode = this.audioContext.createGain()

    // Create stereo panner for ear selection
    const panner = this.audioContext.createStereoPanner()

    // Set panning: -1 = left, 0 = center, 1 = right
    if (ear === "Left") {
      panner.pan.value = -1
    } else if (ear === "Right") {
      panner.pan.value = 1
    } else {
      panner.pan.value = 0
    }

    // Configure oscillator
    this.oscillator.type = "sine"
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

    // Convert dB to linear gain (assuming 0 dB = 0.1 linear gain as reference)
    const linearGain = Math.pow(10, volumeDb / 20) * 0.1

    // Apply envelope (fast attack, fast decay)
    const now = this.audioContext.currentTime
    const attackTime = 0.01 // 10ms attack
    const releaseTime = 0.01 // 10ms release
    const sustainTime = durationMs / 1000 - attackTime - releaseTime

    this.gainNode.gain.setValueAtTime(0, now)
    this.gainNode.gain.linearRampToValueAtTime(linearGain, now + attackTime)
    this.gainNode.gain.setValueAtTime(linearGain, now + attackTime + sustainTime)
    this.gainNode.gain.linearRampToValueAtTime(0, now + attackTime + sustainTime + releaseTime)

    // Add warble if enabled (±5% frequency modulation at 5 Hz)
    if (warble) {
      this.warbleLFO = this.audioContext.createOscillator()
      this.warbleGain = this.audioContext.createGain()

      this.warbleLFO.type = "sine"
      this.warbleLFO.frequency.setValueAtTime(5, now) // 5 Hz warble
      this.warbleGain.gain.setValueAtTime(frequency * 0.05, now) // ±5% modulation

      this.warbleLFO.connect(this.warbleGain)
      this.warbleGain.connect(this.oscillator.frequency)
      this.warbleLFO.start(now)
    }

    // Connect audio graph
    this.oscillator.connect(this.gainNode)
    this.gainNode.connect(panner)
    panner.connect(this.audioContext.destination)

    // Start and stop
    this.oscillator.start(now)
    this.oscillator.stop(now + durationMs / 1000)

    this.isPlaying = true

    // Clean up when done
    setTimeout(() => {
      this.isPlaying = false
      this.oscillator = null
      this.gainNode = null
      if (this.warbleLFO) {
        this.warbleLFO = null
        this.warbleGain = null
      }
    }, durationMs)
  }

  stopTone() {
    if (this.oscillator && this.isPlaying) {
      try {
        this.oscillator.stop()
      } catch (error) {
        // Oscillator might already be stopped
      }
    }
    if (this.warbleLFO) {
      try {
        this.warbleLFO.stop()
      } catch (error) {
        // LFO might already be stopped
      }
    }
    this.isPlaying = false
    this.oscillator = null
    this.gainNode = null
    this.warbleLFO = null
    this.warbleGain = null
  }

  async playPinkNoise(durationMs: number, volumeDb: number): Promise<void> {
    await this.ensureAudioContext()

    if (!this.audioContext) {
      throw new Error("Audio context not available")
    }

    // Create buffer for pink noise
    const bufferSize = this.audioContext.sampleRate * (durationMs / 1000)
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate)
    const data = buffer.getChannelData(0)

    // Generate pink noise using Paul Kellet's algorithm
    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    }

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = buffer
    const linearGain = Math.pow(10, volumeDb / 20) * 0.1
    gainNode.gain.setValueAtTime(linearGain, this.audioContext.currentTime)

    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    source.start()
  }

  getIsPlaying(): boolean {
    return this.isPlaying
  }

  async testChannels(): Promise<{ left: boolean; right: boolean }> {
    // Play test tones in each channel and return which ones are working
    // This is a simplified version - in practice you'd want user feedback
    try {
      await this.playTone(1000, 500, -20, "Left")
      await new Promise((resolve) => setTimeout(resolve, 600))
      await this.playTone(1000, 500, -20, "Right")
      await new Promise((resolve) => setTimeout(resolve, 600))
      return { left: true, right: true }
    } catch (error) {
      console.error("Channel test failed:", error)
      return { left: false, right: false }
    }
  }
}

// Singleton instance
export const toneEngine = new ToneEngine()
