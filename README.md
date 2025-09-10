# HearRight - AI-Generated App-Based Audiometer

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/chinmayidasanna-2963s-projects/v0-new-chat)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/LiIBcy2DtUm)

## Overview

HearRight is a comprehensive Progressive Web App (PWA) that performs pure-tone audiometry testing using the Web Audio API. Designed for healthcare professionals and hearing screening programs, it provides accurate hearing assessments with professional-grade audiogram generation and PDF reporting capabilities.

## ⚡ Key Features

### 🎯 **Optimized 2-Minute Testing**
- Streamlined 4-frequency protocol (500Hz, 1kHz, 2kHz, 4kHz)
- Fast Hughson-Westlake algorithm with single reversal
- Automatic ear switching with visual feedback
- Real-time progress tracking

### 🎧 **Professional Audio Engine**
- Web Audio API-based tone generation
- Calibration system for different headphones/devices
- Left/right channel testing and phase checking
- Envelope control with warble modulation option

### 📊 **Medical-Grade Audiograms**
- Standard audiogram format with proper symbols
- Red circles (O) for right ear, blue crosses (X) for left ear
- Pure Tone Average (PTA) calculations
- Clinical hearing loss interpretations

### 📄 **Comprehensive Reporting**
- Professional PDF report generation
- Patient information management
- Threshold tables and audiogram visualization
- Medical disclaimers and methodology notes

### 💾 **Offline-First Architecture**
- IndexedDB storage for patient data
- Service worker for offline functionality
- PWA installation support
- Data export/import capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- Modern web browser with Web Audio API support
- Headphones or calibrated audio equipment

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/chinmayi200402/HearRight--2.git
   cd HearRight--2
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Production Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## 📱 Usage Guide

### 1. **Patient Setup**
- Enter patient demographics and contact information
- Review environment requirements and medical disclaimers
- Ensure quiet testing environment

### 2. **Device Calibration**
- Connect and test headphones/audio equipment
- Verify left/right channel functionality
- Set reference volume levels
- Adjust frequency-specific calibration if needed

### 3. **Hearing Test**
- Follow on-screen instructions for each ear
- Respond when you hear tones using "Heard"/"Not Heard" buttons
- Test automatically progresses through frequencies
- Complete test in approximately 2 minutes

### 4. **Results & Reports**
- View real-time audiogram visualization
- Review hearing loss classifications and PTA values
- Generate and download professional PDF reports
- Access patient history and previous tests

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Component library
- **Recharts** - Audiogram visualization
- **Zustand** - State management

### Audio & Medical
- **Web Audio API** - Tone generation and audio processing
- **Hughson-Westlake Algorithm** - Clinical threshold detection
- **PDF-lib** - Professional report generation
- **Dexie** - IndexedDB wrapper for offline storage

### PWA Features
- **Service Worker** - Offline functionality and caching
- **Web App Manifest** - Installation and app-like experience
- **IndexedDB** - Client-side data persistence

## 🔧 Configuration

### Audio Calibration
The app includes calibration profiles for common headphone types:
- Over-ear headphones
- In-ear monitors
- Bone conduction devices
- Custom calibration profiles

### Frequency Testing
Default frequencies tested (optimized for 2-minute completion):
- 500 Hz - Low frequency hearing
- 1000 Hz - Speech clarity baseline
- 2000 Hz - Speech understanding
- 4000 Hz - High-frequency hearing loss detection

## 📊 Medical Compliance

### Standards Adherence
- Follows ANSI S3.21 audiometric standards
- Implements ISO 8253 pure-tone audiometry guidelines
- Uses clinical Hughson-Westlake methodology
- Provides appropriate medical disclaimers

### Data Privacy
- All patient data stored locally (IndexedDB)
- No data transmitted without explicit consent
- HIPAA-compliant data handling practices
- Secure PDF generation and storage

## ⚠️ Medical Disclaimer

**IMPORTANT**: HearRight is designed as a hearing screening tool and should not replace professional audiological evaluation. Results should be interpreted by qualified healthcare professionals. This application is not intended for diagnostic purposes and should not be used as the sole basis for medical decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain medical accuracy and compliance
- Test audio functionality across different devices
- Ensure accessibility standards (WCAG 2.1)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For technical support or medical questions:
- Create an issue in this repository
- Contact the development team
- Consult with qualified audiological professionals for clinical interpretation

## 🔄 Version History

- **v1.0.0** - Initial release with core audiometry features
- **v1.1.0** - Optimized 2-minute testing protocol
- **v1.2.0** - Enhanced PDF reporting and PWA capabilities

---

**Built with ❤️ using [v0.app](https://v0.app) - The AI-powered development platform**
