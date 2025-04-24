export default {
  "owner": "serenityspaceteam",
  "name": "serenity-space-app",
  "slug": "serenity-space-app",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "myapp",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.serenityspaceteam.app"
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    },
    "package": "com.serenityspaceteam.app"
  },
  "web": {
    "bundler": "metro",
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  },
  "plugins": [
    "@react-native-google-signin/google-signin",
    "expo-router",
    "expo-build-properties",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff"
      },
    ],
    "@stream-io/video-react-native-sdk",
    [
      "@config-plugins/react-native-webrtc",
      {
        "cameraPermission": "$(PRODUCT_NAME) necesita acceso a la cámara para video",
        "microphonePermission": "$(PRODUCT_NAME) necesita acceso al micrófono para audio"
      }
    ]
  ],
  "experiments": {
    "typedRoutes": true
  },
  "extra": {
    "router": {
      "origin": false
    },
    "eas": {
      "projectId": "dd9c21e6-ccdf-4d33-a241-bf3da409c53c"
    }
  },
  googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID ?? process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
}