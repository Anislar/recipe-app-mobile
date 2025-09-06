/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
//import { I18nManager } from "react-native";

import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import { getItemAsync, setItem } from "expo-secure-store";

export const Lang = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
];

const languageMap: Record<string, () => Promise<any>> = {
  en: () => import("./en.json"),
  fr: () => import("./fr.json"),
};

const LANGUAGE_KEY = "Language_key";
const fallbackLng = "en";
const detectedLng =
  Localization.getLocales()[0]?.languageTag.split("-")[0] || fallbackLng;

i18n.use(initReactI18next).init({
  lng: fallbackLng,
  fallbackLng,
  resources: {},
  interpolation: {
    escapeValue: false,
  },
});

export const loadLanguageAsync = async (lng: string) => {
  if (!i18n.hasResourceBundle(lng, "translation")) {
    const translationModule = await languageMap[lng]?.();
    if (translationModule) {
      i18n.addResourceBundle(lng, "translation", translationModule.default);
    }
  }

  i18n.changeLanguage(lng);
  setItem(LANGUAGE_KEY, lng);
  // const isRTL = lng === "ar";
  // I18nManager.forceRTL(isRTL);
};

export const loadStoredLanguage = async () => {
  const stored = await getItemAsync(LANGUAGE_KEY);
  if (stored) {
    await loadLanguageAsync(stored);
  } else {
    await loadLanguageAsync(detectedLng);
  }
};

export default i18n;
