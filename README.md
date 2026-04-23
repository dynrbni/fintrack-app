# FinTrack

FinTrack is a React Native mobile app scaffold for personal finance tracking.

## Stack

- Expo + React Native + TypeScript
- Expo Router for navigation
- Supabase for auth, database, and email parsing backend

## Setup

1. Copy `.env.example` to `.env` and fill in your Supabase values.
2. Run `npm install`.
3. Start the app with `npm run start`.

## Running

- `npm run start` launches Metro and lets you open the app in Expo Go.
- `npm run web` starts the web build at `http://localhost:8082` when available.
- `npm run ios` requires the full Xcode app, not just Command Line Tools.
- If you only want to test on an iPhone or Android device, use `npm run start` and scan the QR code in Expo Go.

If iOS fails with `xcrun simctl` or `xcodebuild` errors, install Xcode from the App Store, open it once, accept the license, then run:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

## Supabase

The repository includes starter SQL and edge-function files for profiles, wallets, transactions, and parsed emails.