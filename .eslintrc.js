export default {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ["@react-native-community", "eslint:recommended"],

  plugins: ["react", "react-native", "unused-imports", "simple-import-sort"],

  settings: {
    react: {
      version: "detect",
    },
  },

  rules: {
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

    "sort-imports": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",

    "max-len": [
      "error",
      {
        code: 70,
        ignoreComments: true,
        ignoreUrls: true,
      },
    ],
  },

  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  globals: {
    globalThis: "readonly",
    SERVER_URL: "readonly",
    crashlytics: "readonly",
    axios: "readonly",
    AsyncStorage: "readonly",
  },
};
