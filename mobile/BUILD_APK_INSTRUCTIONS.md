# Building DealVictor Mobile APK

## Option 1: Using Expo Go (Quickest for Testing)

1. Install "Expo Go" app on your Android phone from Play Store
2. Navigate to mobile folder: `cd mobile`
3. Install dependencies: `npm install`
4. Start development server: `npx expo start`
5. Scan the QR code with Expo Go app

## Option 2: Build APK Locally (Requires Java)

### Prerequisites
- Node.js 20+
- Java JDK 17
- Android SDK

### Steps
1. Navigate to mobile folder: `cd mobile`
2. Install dependencies: `npm install`
3. Prebuild Android: `npx expo prebuild --platform android`
4. Build APK: `cd android && ./gradlew assembleRelease`
5. APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## Option 3: Using EAS Build (Cloud Build - Recommended)

### Prerequisites
- Expo account (free at https://expo.dev)

### Steps
1. Navigate to mobile folder: `cd mobile`
2. Login to Expo: `npx eas login`
3. Build APK: `npx eas build --platform android --profile preview`
4. Download APK from the link provided after build completes

## Configuration

The app is configured in `app.json`:
- Package name: `com.dealvictor.mobile`
- App name: DealVictor
- Primary color: #6366f1

## Environment Variables

Create `.env` file with your backend URL:
```
API_URL=http://your-server-ip:5000/api
```

## Testing on Device

After building, transfer the APK to your Android device and install it.
Make sure to enable "Install from unknown sources" in your Android settings.
