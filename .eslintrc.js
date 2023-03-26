module.exports = {
  root: true,
  extends: ['@react-native-community', 'eslint:recommended'],
  plugins: ['react', 'react-native'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        singleQuote: true,
        semi: true,
      },
    ],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
  },
  globals: {
    SERVER_URL: 'readonly',
    crashlytics: 'readonly',
    axios: 'readonly',
    AsyncStorage: 'readonly',
  },
};
