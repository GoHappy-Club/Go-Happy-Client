import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { NativeModules, Platform } from "react-native";

const deviceLanguage =
  Platform.OS === "ios"
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

const defaultLanguage = "en";
const supportedLanguages = ["en", "hi"];

const getLanguageToUse = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem("@lang");
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      return savedLanguage;
    }
    const deviceLang = deviceLanguage.split("-")[0];
    return supportedLanguages.includes(deviceLang)
      ? deviceLang
      : defaultLanguage;
  } catch (error) {
    console.error("Error retrieving language:", error);
    return defaultLanguage;
  }
};

getLanguageToUse().then((languageToUse) => {
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    fallbackLng: defaultLanguage,
    lng: languageToUse,
    resources: {
      en: {
        translation: require("./locales/en/translation.json"),
      },
      hi: {
        translation: require("./locales/hi/translation.json"),
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
});

export default i18n;
