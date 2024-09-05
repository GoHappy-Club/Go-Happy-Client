// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier; 

const defaultLanguage = 'en';

const supportedLanguages = ['en', 'hi']; 
const languageToUse = supportedLanguages.includes(deviceLanguage.split('-')[0])
  ? deviceLanguage.split('-')[0] 
  : defaultLanguage;

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: defaultLanguage,
    lng: languageToUse,
    resources: {
      en: {
        translation: require('./locales/en/translation.json'),
      },
      hi: {
        translation: require('./locales/hi/translation.json'),
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
