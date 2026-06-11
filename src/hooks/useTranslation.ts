// File: src/hooks/useTranslation.ts — Custom hook for handling i18n
import { useState, useCallback, useEffect } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';

type Language = 'en' | 'hi';
const translations: Record<Language, Record<string, string>> = { en, hi };

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: string): string => {
    return translations[lang][key] || key;
  }, [lang]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'hi' : 'en');

  return { t, lang, toggleLanguage };
};
