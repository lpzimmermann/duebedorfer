# Dübendorfer

A web app for counting points in Dübendorfer, a Swiss Jass variant.

Built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) and [Vite](https://vite.dev/).

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Deployment

Pushes to `main` are automatically built and deployed to GitHub Pages via the workflow in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To enable it, set the repository's **Settings → Pages → Source** to "GitHub Actions".

## Android app

The `android/` directory is a [Capacitor](https://capacitorjs.com/) wrapper that bundles the web
app locally on the device, so it works fully offline (no server, no network needed at the table).

A debug APK is built automatically by
[`.github/workflows/android-apk.yml`](.github/workflows/android-apk.yml) — trigger it manually
from the **Actions** tab (*Build Android APK* → *Run workflow*) and download the `duebedorfer-debug-apk`
artifact from the finished run. It's a debug build (self-signed, not for the Play Store), so
Android will ask you to allow installs from this source the first time.

To build it locally instead (requires the Android SDK):

```sh
npm run android:sync   # builds the web bundle and copies it into android/
cd android
./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

The app name, package ID (`ch.duebedorfer.jass`), and icons all use Capacitor's defaults for
now — worth customizing if this becomes more than a debug build for friends.
