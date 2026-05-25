import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getTranslation } from '../i18n/translations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  
  // Get current language from localStorage or default to 'en'
  const getLang = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  };

  const lang = getLang();
  const t = (key) => getTranslation(lang, key);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // GSAP fade-in animation for hero section
  useEffect(() => {
    if (!heroRef.current) return;

    gsap.fromTo(
      heroRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      }
    );
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const lineVars = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 1, ease: 'easeInOut', delay: 0.5 } }
  };

  return (
    <section ref={heroRef} style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%)', borderRadius: '50%', top: '10%', right: '10%', pointerEvents: 'none' }} animate={{ x: mousePosition.x * 0.05, y: mousePosition.y * 0.05 }} transition={{ type: 'spring', stiffness: 100, damping: 30 }} />
      <motion.div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(204, 255, 0, 0.05) 0%, transparent 70%)', borderRadius: '50%', bottom: '10%', left: '5%', pointerEvents: 'none' }} animate={{ x: -mousePosition.x * 0.03, y: -mousePosition.y * 0.03 }} transition={{ type: 'spring', stiffness: 100, damping: 30 }} />

      <motion.div className="container" variants={containerVars} initial="hidden" animate="show" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div variants={lineVars} style={{ width: '60px', height: '2px', background: 'var(--accent-cyan)', marginBottom: '2rem', transformOrigin: 'left' }} />
        <motion.p variants={itemVars} className="mono-text text-cyan" style={{ marginBottom: '1rem' }}>&gt; System_Ready: Nendi Candra</motion.p>
        <motion.div variants={itemVars}>
          <h1 style={{ marginBottom: '1rem' }}>{t('hero.title')}</h1>
        </motion.div>
        <motion.div variants={itemVars}>
          <h2 style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('hero.subtitle')}</h2>
        </motion.div>
        <motion.p variants={itemVars} style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '3rem', lineHeight: '1.6' }}>
          {t('hero.description')}
        </motion.p>
        <motion.div variants={itemVars} style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.a href="#about" className="btn-brutal" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {t('hero.cta')}
          </motion.a>
          <motion.span className="mono-text" style={{ color: 'var(--text-muted)' }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
            // Scroll down
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}