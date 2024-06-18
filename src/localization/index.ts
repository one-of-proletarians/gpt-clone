import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./languages/en.json";
import ru from "./languages/ru.json";
import de from "./languages/de.json";
import tr from "./languages/tr.json";
import ua from "./languages/ua.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: "en",
    resources: { en, ru, de, tr, ua },
  });

export default i18n;
