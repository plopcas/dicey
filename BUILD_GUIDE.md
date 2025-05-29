# 📱 Building Dicey for Android - Complete Guide

This guide will walk you through building a production-ready APK for Android that can be installed on devices and submitted to the Play Store.

## 🛠️ Prerequisites

1. **Expo Account** - Create a free account at [expo.dev](https://expo.dev)
2. **EAS CLI** - Already installed (`eas-cli`)
3. **Android Studio** (optional, for local builds)

## 🚀 Quick Build Steps

### 1. Login to Expo
```bash
cd mobile
eas login
```
Enter your Expo account credentials when prompted.

### 2. Configure the Project
```bash
eas build:configure
```
This will set up the build configuration automatically.

### 3. Build APK for Testing
```bash
eas build --platform android --profile preview
```
This creates an APK that can be installed on any Android device for testing.

### 4. Build AAB for Play Store
```bash
eas build --platform android --profile production
```
This creates an Android App Bundle (AAB) optimized for Play Store distribution.

## 📋 Build Profiles Explained

### Preview Profile (`preview`)
- **Output**: APK file
- **Purpose**: Testing on devices
- **Signing**: Debug signing
- **Size**: Larger (includes all architectures)
- **Distribution**: Direct installation

### Production Profile (`production`)
- **Output**: AAB (Android App Bundle)
- **Purpose**: Play Store submission
- **Signing**: Release signing (managed by Expo)
- **Size**: Optimized for each device
- **Distribution**: Google Play Store only

### Production APK Profile (`production-apk`)
- **Output**: APK file
- **Purpose**: Production APK for direct distribution
- **Signing**: Release signing
- **Size**: Larger but production-ready
- **Distribution**: Direct installation or alternative stores

## 🎯 Recommended Build Process

### For Testing
```bash
# Build test APK
eas build --platform android --profile preview

# Download and install on your Android device
# The build will provide a download link
```

### For Play Store Submission
```bash
# Build production AAB
eas build --platform android --profile production

# Submit to Play Store (optional, using EAS Submit)
eas submit --platform android
```

## 📁 Build Configuration Files

### `eas.json` - Build Configuration
- Defines build profiles for different purposes
- Configures Android build types (APK vs AAB)
- Sets up submission parameters

### `app.json` - App Configuration
- App metadata (name, version, description)
- Android-specific settings (package name, permissions)
- Play Store configuration

## 🔐 App Signing

### Automatic Signing (Recommended)
- Expo manages signing keys automatically
- Works for both APK and AAB builds
- Suitable for Play Store submission
- No manual key management required

### Manual Signing (Advanced)
If you need custom signing keys:
```bash
# Generate keystore
keytool -genkey -v -keystore dicey-release-key.keystore -alias dicey-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Configure in eas.json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab",
        "credentialsSource": "local"
      }
    }
  }
}
```

## 📊 Build Monitoring

### Check Build Status
```bash
eas build:list
```

### View Build Logs
```bash
eas build:view [BUILD_ID]
```

### Download Builds
Builds are automatically available for download from:
- Expo dashboard: [expo.dev/accounts/[username]/projects/dicey-mobile/builds](https://expo.dev)
- Direct download links provided after successful builds

## 🎮 Testing Your APK

### Install on Android Device
1. Download the APK file from the build
2. Enable "Install from Unknown Sources" on your Android device
3. Transfer APK to device or download directly
4. Install and test all features:
   - Dice configuration creation
   - Rolling dice
   - Saving configurations
   - Roll history
   - Data persistence

### Test Checklist
- [ ] App installs successfully
- [ ] All tabs work (Builder, Saved, History)
- [ ] Dice rolling produces random results
- [ ] Configurations save and persist
- [ ] Roll history is maintained
- [ ] App works offline
- [ ] No crashes or errors

## 🏪 Play Store Preparation

### Required Assets
1. **App Icon** - 512x512 PNG (high-res icon)
2. **Feature Graphic** - 1024x500 PNG
3. **Screenshots** - At least 2 phone screenshots
4. **Privacy Policy** - Required for data collection
5. **App Description** - Short and full descriptions

### Play Store Listing Info
```
Title: Dicey - Dice Roller
Short Description: Modern dice rolling app for tabletop gaming with custom configurations and roll history.

Full Description:
Dicey is a beautiful, modern dice rolling application designed for tabletop gamers, board game enthusiasts, and anyone who needs reliable dice rolls.

Features:
🎲 Custom Dice Configurations - Create and save any combination of dice (D4, D6, D8, D10, D12, D20, D100)
📊 Roll History - Keep track of all your rolls with detailed results and timestamps
💾 Local Storage - All data is saved locally on your device for privacy
🎨 Modern Design - Clean, intuitive interface optimized for mobile devices
⚡ Fast & Reliable - Instant dice rolls with secure random number generation

Perfect for:
- Dungeons & Dragons (D&D)
- Pathfinder
- Board games
- Tabletop RPGs
- Any game requiring dice rolls

Privacy focused - no account required, no data collection, works completely offline.
```

### Categories
- **Primary**: Entertainment
- **Secondary**: Games > Board

### Content Rating
- **Target Audience**: Everyone
- **Content**: No violent, sexual, or inappropriate content

## 🚀 Build Commands Summary

```bash
# One-time setup
eas login
eas build:configure

# Build for testing
eas build --platform android --profile preview

# Build for Play Store
eas build --platform android --profile production

# Check build status
eas build:list

# Submit to Play Store (optional)
eas submit --platform android
```

## 📱 Alternative: Local Build (Advanced)

If you prefer to build locally:

### Install Android Studio
1. Download Android Studio
2. Install Android SDK (API level 34)
3. Set up environment variables

### Build Locally
```bash
# Generate native Android project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease

# Build AAB
./gradlew bundleRelease
```

## 🎯 Next Steps

1. **Test thoroughly** on multiple Android devices
2. **Gather feedback** from beta testers
3. **Create Play Store assets** (screenshots, descriptions)
4. **Set up Play Console account** ($25 one-time fee)
5. **Submit for review** (typically 1-3 days)

## 📞 Support

- **Expo Documentation**: [docs.expo.dev](https://docs.expo.dev)
- **EAS Build Guide**: [docs.expo.dev/build/introduction](https://docs.expo.dev/build/introduction)
- **Play Store Guide**: [developer.android.com/distribute/console](https://developer.android.com/distribute/console)

Your Dicey app is ready for the Play Store! 🎲🚀