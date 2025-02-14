export const root = true;
export const env = {
  node: true,
};
export const extendConfigs = ["@react-native-community", "eslint:recommended"];
export const plugins = ["react", "react-native", "unused-imports"];
export const settings = {
  react: {
    version: "detect",
  },
};
export const rules = {
  "prettier/prettier": [
    "warn",
    {
      singleQuote: true,
      semi: true,
    },
  ],
  "no-unused-vars": "error",
  "unused-imports/no-unused-imports": "error",
  "no-console": "warn",
  "sort-imports": [
    "error",
    {
      ignoreDeclarationSort: true,
    },
  ],
};
export const globals = {
  SERVER_URL: "readonly",
  crashlytics: "readonly",
  axios: "readonly",
  AsyncStorage: "readonly",
};
