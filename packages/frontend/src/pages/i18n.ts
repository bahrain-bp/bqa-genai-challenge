// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en.json';
import arTranslation from './ar.json';

// Initialize i18next
i18n
  .use(initReactI18next) // Bind react-i18next to i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation }
    },
    fallbackLng: 'ar', // Fallback language if translation is not available
    debug: true, // Enable debug mode for logging
    interpolation: {
      escapeValue: false // React already does escaping
    }
  });

export default i18n;
