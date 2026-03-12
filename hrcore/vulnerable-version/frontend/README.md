# HRCore Frontend (Vulnerable)

React Native (Expo). **Vulnerability #7:** Role is read from AsyncStorage — editing `role` to `admin` grants access to Admin Panel until backend is fixed.

## Run

```bash
npm install
npx expo start
```

- Use Expo Go on a device or simulator.
- Set `EXPO_PUBLIC_API_URL` to your backend (e.g. `http://192.168.1.x:3000`) when not using localhost.

## Assets

If Expo reports missing assets, create an `assets` folder with:

- `icon.png` (1024×1024)
- `splash.png`
- `adaptive-icon.png`

Or copy the `assets` folder from a new app: `npx create-expo-app _temp --template blank` then copy `_temp/assets` here.
