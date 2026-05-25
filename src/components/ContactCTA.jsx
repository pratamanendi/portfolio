import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTranslation } from '../i18n/translations';

function ContactCTA() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Get current language from localStorage or default to 'en'
  const getLang = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  };

  const lang = getLang();
  const t = (key) => getTranslation(lang, key);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message }),
      });

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
        setMessage('');
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="container section" style={{ paddingTop: '8rem', paddingBottom: '8rem', backgroundColor: '#0a0a0a', border: '2px solid #333', marginTop: '4rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
          {t('contact.title').split(' ')[0]} <span className="text-lime">{t('contact.title').split(' ')[1]}</span>
        </h2>

        {submitted ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '2rem', backgroundColor: '#1a3a1a', border: '2px solid var(--accent-lime)', textAlign: 'center', color: 'var(--accent-lime)' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t('contact.success')}</p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>{t('contact.successMsg')}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('contact.email')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('contact.email').toLowerCase()} required style={{ width: '100%', padding: '0.8rem', backgroundColor: '#1a1a1a', border: '2px solid #333', color: 'var(--text-main)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>{t('contact.message')}</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('contact.placeholder')} required rows="5" style={{ width: '100%', padding: '0.8rem', backgroundColor: '#1a1a1a', border: '2px solid #333', color: 'var(--text-main)', resize: 'vertical' }} />
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ padding: '1rem', backgroundColor: 'var(--accent-cyan)', color: '#000', border: 'none', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? t('contact.sending') : t('contact.send')}
            </motion.button>
          </form>
        )}

        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #333', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>LinkedIn</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>Twitter</a>
        </div>
      </div>
    </section>
  );
}

export default ContactCTA;