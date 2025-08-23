export interface Trial {
  levelDb: number
  heard: boolean
  timestamp: number
}

export interface StaircaseState {
  currentLevel: number
  trials: Trial[]
  isComplete: boolean
  threshold?: number
  direction: "ascending" | "descending"
  reversals: number
  ascendingResponses: number
  lastReversalLevel?: number
}

export class HughsonWestlakeStaircase {
  private state: StaircaseState
  private readonly maxLevel: number
  private readonly minLevel: number
  private readonly startLevel: number

  constructor(startLevel = 30, minLevel = 0, maxLevel = 100) {
    this.startLevel = startLevel
    this.minLevel = minLevel
    this.maxLevel = maxLevel
    this.state = {
      currentLevel: startLevel,
      trials: [],
      isComplete: false,
      direction: "ascending",
      reversals: 0,
      ascendingResponses: 0,
    }
  }

  addResponse(heard: boolean): void {
    if (this.state.isComplete) {
      throw new Error("Staircase is already complete")
    }

    const trial: Trial = {
      levelDb: this.state.currentLevel,
      heard,
      timestamp: Date.now(),
    }

    this.state.trials.push(trial)

    // If no response at start level, increase by 20 dB until response
    if (this.state.trials.length === 1 && !heard) {
      this.state.currentLevel = Math.min(this.state.currentLevel + 20, this.maxLevel)
      return
    }

    // Once we get first response, switch to standard algorithm
    if (this.state.trials.length === 1 && heard) {
      this.state.direction = "descending"
      this.state.currentLevel = Math.max(this.state.currentLevel - 10, this.minLevel)
      return
    }

    // Standard Hughson-Westlake algorithm
    const previousDirection = this.state.direction

    if (heard) {
      // Response heard - go down 10 dB (or continue ascending if we were ascending)
      if (this.state.direction === "descending") {
        this.state.currentLevel = Math.max(this.state.currentLevel - 10, this.minLevel)
      } else {
        // We were ascending and got a response - this is a reversal
        this.state.reversals++
        this.state.lastReversalLevel = this.state.currentLevel
        this.state.direction = "descending"
        this.state.currentLevel = Math.max(this.state.currentLevel - 10, this.minLevel)
        this.state.ascendingResponses = 0
      }
    } else {
      // No response - go up 5 dB
      if (this.state.direction === "ascending") {
        this.state.currentLevel = Math.min(this.state.currentLevel + 5, this.maxLevel)
        this.state.ascendingResponses++
      } else {
        // We were descending and got no response - this is a reversal
        this.state.reversals++
        this.state.lastReversalLevel = this.state.currentLevel
        this.state.direction = "ascending"
        this.state.currentLevel = Math.min(this.state.currentLevel + 5, this.maxLevel)
        this.state.ascendingResponses = 1
      }
    }

    // Check for completion
    this.checkCompletion()
  }

  private checkCompletion(): void {
    if (this.state.reversals >= 1 && this.state.ascendingResponses >= 1) {
      const ascendingTrials = this.state.trials.filter((trial, index) => {
        if (index === 0) return false
        const prevTrial = this.state.trials[index - 1]
        return trial.levelDb > prevTrial.levelDb && trial.heard
      })

      if (ascendingTrials.length >= 1) {
        const levels = ascendingTrials.map((t) => t.levelDb).sort((a, b) => a - b)
        this.state.threshold = Math.max(levels[0], 0)
        this.state.isComplete = true
      }
    }

    if (this.state.trials.length >= 8) {
      const responses = this.state.trials.filter((t) => t.heard)
      if (responses.length > 0) {
        this.state.threshold = Math.max(Math.min(...responses.map((t) => t.levelDb)), 0)
      } else {
        this.state.threshold = this.maxLevel
      }
      this.state.isComplete = true
    }
  }

  getCurrentLevel(): number {
    return this.state.currentLevel
  }

  getThreshold(): number | undefined {
    return this.state.threshold
  }

  isComplete(): boolean {
    return this.state.isComplete
  }

  getTrials(): Trial[] {
    return [...this.state.trials]
  }

  getState(): StaircaseState {
    return { ...this.state }
  }

  reset(): void {
    this.state = {
      currentLevel: this.startLevel,
      trials: [],
      isComplete: false,
      direction: "ascending",
      reversals: 0,
      ascendingResponses: 0,
    }
  }
}
