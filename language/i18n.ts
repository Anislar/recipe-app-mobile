// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./en.json";
import fr from "./fr.json";
const resources = {
  en,
  fr,
};

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0]?.languageTag.split("-")[0], // e.g. "en" from "en-US"
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export default i18n;
