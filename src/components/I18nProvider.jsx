import { useState, useEffect, createContext, useContext } from 'react';
import { getTranslation, defaultLanguage } from '../i18n/translations';

const I18nContext = createContext();

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

export default function I18nProvider({ children }) {
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    const saved = localStorage.getItem('language') || defaultLanguage;
    setLanguage(saved);
    document.documentElement.lang = saved;
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    window.location.reload();
  };

  const t = (key) => getTranslation(language, key);

  return (
    <I18nContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}