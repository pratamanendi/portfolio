import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('language') || 'en';
    setCurrentLang(saved);
    document.documentElement.lang = saved;
  }, []);

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    setIsOpen(false);
    // Dispatch event so React components re-render with new language
    window.dispatchEvent(new CustomEvent('languageChanged'));
  };

  return (
    <div style={{ position: 'relative' }}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'none',
          border: '2px solid var(--accent-cyan)',
          color: 'var(--accent-cyan)',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          fontWeight: 'bold',
          borderRadius: '4px',
        }}
      >
        {currentLang.toUpperCase()}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              background: 'var(--surface-color)',
              border: '2px solid var(--accent-cyan)',
              borderRadius: '4px',
              overflow: 'hidden',
              zIndex: 1000,
              minWidth: '160px',
            }}
          >
            <button
              onClick={() => handleLanguageChange('en')}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: currentLang === 'en' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                border: 'none',
                color: currentLang === 'en' ? 'var(--accent-cyan)' : 'var(--text-main)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                textAlign: 'left',
              }}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('id')}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem 1.5rem',
                background: currentLang === 'id' ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                border: 'none',
                color: currentLang === 'id' ? 'var(--accent-cyan)' : 'var(--text-main)',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                textAlign: 'left',
              }}
            >
              Bahasa Indonesia
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}