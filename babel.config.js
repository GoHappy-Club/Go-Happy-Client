module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [['module:react-native-dotenv', {
    "moduleName": "@env",
    "path": ".env",
    "blocklist": null,
    "allowlist": null,
    "safe": false,
    "allowUndefined": true
  }],
'react-native-reanimated/plugin']
};
