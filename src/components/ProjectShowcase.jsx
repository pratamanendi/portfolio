import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getTranslation } from '../i18n/translations';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: 1, titleKey: 'projects.project1.title', descKey: 'projects.project1.description', tags: ['React', 'Claude API', 'Streaming', 'TypeScript'], link: '#', color: 'var(--accent-cyan)' },
  { id: 2, titleKey: 'projects.project2.title', descKey: 'projects.project2.description', tags: ['Astro', 'React', 'AI', 'SSG'], link: '#', color: 'var(--accent-lime)' },
  { id: 3, titleKey: 'projects.project3.title', descKey: 'projects.project3.description', tags: ['Next.js', 'OpenRouter', 'Analytics', 'Tailwind'], link: '#', color: 'var(--accent-purple)' },
  { id: 4, titleKey: 'projects.project4.title', descKey: 'projects.project4.description', tags: ['Vue 3', 'AI', 'Content', 'Automation'], link: '#', color: 'var(--accent-cyan)' },
  { id: 5, titleKey: 'projects.project5.title', descKey: 'projects.project5.description', tags: ['React', 'AI', 'Forms', 'ML'], link: '#', color: 'var(--accent-lime)' },
  { id: 6, titleKey: 'projects.project6.title', descKey: 'projects.project6.description', tags: ['GitHub API', 'Claude', 'Automation', 'DevOps'], link: '#', color: 'var(--accent-purple)' },
];

export default function ProjectShowcase() {
  const [hoveredId, setHoveredId] = useState(null);
  const containerRef = useRef(null);
  
  // Get current language from localStorage or default to 'en'
  const getLang = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'en';
    }
    return 'en';
  };

  const lang = getLang();
  const t = (key) => getTranslation(lang, key);

  // GSAP Stagger animation for project cards
  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('[data-project-card]');
    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section id="projects" className="container section" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>
        {t('projects.title').split(' ')[0]} <span className="text-cyan">{t('projects.title').split(' ')[1]}</span>
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '4rem', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
        {t('projects.description')}
      </p>

      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        {projects.map((project) => (
          <motion.div
            key={project.id}
            data-project-card
            style={{ border: '2px solid #333', padding: '2rem', position: 'relative', cursor: 'pointer', overflow: 'hidden' }}
            whileHover={{ y: -5 }}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', backgroundColor: project.color }} />
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem' }}>{t(project.titleKey)}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{t(project.descKey)}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {project.tags.map((tag) => (
                <span key={tag} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: '#1a1a1a', border: `1px solid ${project.color}`, color: project.color, fontFamily: 'var(--font-mono)' }}>{tag}</span>
              ))}
            </div>
            <motion.a href={project.link} style={{ display: 'inline-block', padding: '0.8rem 1.5rem', backgroundColor: project.color, color: '#000', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {t('projects.viewProject')}
            </motion.a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}