import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const languages = [
  {
    code: 'en-US',
    name: 'English',
    translation: {} as { [key: string]: string },
  },
  {
    code: 'sk-SK',
    name: 'Slovenčina',
    translation: {
      Settings: 'Nastavenia',
    },
  },
];

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: languages.reduce((acc, lang) => {
      acc[lang.code] = { translation: lang.translation };
      return acc;
    }, {} as { [code: string]: { translation: { [key: string]: string } } }),
    fallbackLng: 'en-US',
    nsSeparator: false,
    keySeparator: false,
    detection: { caches: ['localStorage'], order: ['localStorage', 'navigator'] },
    whitelist: languages.map(lang => lang.code),
  });

export default i18n;
