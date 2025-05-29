# 🎲 Dicey - Digital Dice Rolling App

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.2-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2053-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A modern, cross-platform dice rolling application built with React and React Native, featuring custom dice configurations, roll history, and local storage persistence.

## ✨ Features

- **Custom Dice Configurations**: Create and save custom sets of dice (1D6, 2D20, 3D4 + 1D12, etc.)
- **Secure Random Number Generation**: Uses crypto-secure RNG when available
- **Local Storage**: All data persists locally on your device
- **Roll History**: Track all your dice rolls with timestamps
- **Cross-Platform**: Works on web browsers and mobile devices
- **Clean UI**: Simple, intuitive interface with visual feedback

## 🏗️ Project Structure

```
dicey/
├── shared/           # Shared TypeScript types and utilities
│   ├── types.ts      # Type definitions
│   └── utils.ts      # Dice rolling logic and utilities
├── web/              # React web application
│   ├── public/       # Static assets
│   ├── src/          # Web app source code
│   └── package.json  # Web dependencies
└── mobile/           # React Native mobile application
    ├── services/     # Mobile-specific services
    ├── components/   # Mobile UI components
    ├── styles/       # Mobile styles
    └── package.json  # Mobile dependencies
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- For mobile development: Expo CLI and Expo Go app

### Web App Setup

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Mobile App Setup

1. Install Expo CLI globally (if not already installed):
   ```bash
   npm install -g @expo/cli
   ```

2. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```

3. Install dependencies (using legacy peer deps to avoid conflicts):
   ```bash
   npm install --legacy-peer-deps
   ```

4. Start the Expo development server:
   ```bash
   npm start
   ```

5. Use the Expo Go app on your phone to scan the QR code, or use an emulator

### ✅ Resolved Issues

- **Import Path Issues**: Fixed @shared imports by copying shared code to each app
- **SDK Compatibility**: Updated to Expo SDK 53 for latest Expo Go compatibility  
- **TypeScript Conflicts**: Resolved peer dependency conflicts with --legacy-peer-deps
- **Asset References**: Removed missing asset references from app.json

## 🎯 Usage

### Creating Dice Configurations

1. Go to the "Dice Builder" tab
2. Click "Add Die" to add dice to your configuration
3. Set the quantity and type for each die (D4, D6, D8, D10, D12, D20, D100)
4. Enter a name for your configuration
5. Click "Save Configuration"

### Rolling Dice

- **Quick Roll**: Configure dice in the builder and click "Roll Dice"
- **Saved Configuration**: Go to "Saved" tab and click "Roll" on any saved configuration

### Viewing History

- Go to the "History" tab to see all your previous rolls
- Each entry shows the configuration used, individual die results, and timestamp
- Use "Clear History" to remove all roll history

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Mobile**: React Native with Expo
- **Storage**: 
  - Web: localStorage
  - Mobile: AsyncStorage
- **Styling**: CSS-in-JS (React Native) and CSS modules (Web)
- **Build Tools**: Create React App (Web), Expo (Mobile)

## 📱 Platform-Specific Features

### Web
- Responsive design for desktop and mobile browsers
- Keyboard navigation support
- Local storage persistence

### Mobile
- Native iOS and Android app experience
- Touch-optimized interface
- Offline functionality
- Platform-specific storage

## 🔒 Security

- Uses `crypto.getRandomValues()` on web when available
- Falls back to `crypto.randomBytes()` on Node.js environments
- Graceful fallback to `Math.random()` if crypto is unavailable
- No external network requests - fully local application

## 🚀 Getting Started with Git

### Clone the Repository
```bash
git clone <your-repo-url>
cd dicey
```

### Set up both applications
```bash
# Install web dependencies
cd web && npm install && cd ..

# Install mobile dependencies  
cd mobile && npm install --legacy-peer-deps && cd ..
```

### Run the applications
```bash
# Terminal 1: Web app
cd web && npm start

# Terminal 2: Mobile app  
cd mobile && npm start
```

## 📱 Building for Android

### Quick Build (Recommended)
```bash
cd mobile
eas login              # Login to Expo account
eas build --platform android --profile preview    # Build APK for testing
eas build --platform android --profile production # Build AAB for Play Store
```

### Detailed Instructions
See [BUILD_GUIDE.md](BUILD_GUIDE.md) for complete build instructions, Play Store submission guide, and troubleshooting.

### Build Profiles
- **Preview**: APK for device testing
- **Production**: AAB for Play Store submission  
- **Production-APK**: APK for direct distribution

### Play Store Ready
The app is configured for Play Store submission with:
- ✅ Proper package name and versioning
- ✅ Privacy policy and content ratings
- ✅ Store listing assets and descriptions
- ✅ Android app bundle (AAB) support

## 🤝 Contributing

This is a learning project, but contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all new code
- Follow the existing code style and structure
- Test both web and mobile versions before submitting
- Update documentation as needed

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Create React App](https://create-react-app.dev/) for web
- Mobile app powered by [Expo](https://expo.dev/)
- Icons and inspiration from the dice gaming community