import React from 'react';
import { motion } from 'framer-motion';

const stack = [
  "PHP", "JS", "React", "Vue", "Svelte", "Next", "Nuxt", 
  "Cockpit", "Gatsby", "WordPress", "Laravel", "Astro", "Framer Motion"
];

export default function TechStack() {
  return (
    <div style={{ overflow: 'hidden', padding: '4rem 0', backgroundColor: 'var(--surface-color)', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>
      <div className="container" style={{ marginBottom: '2rem' }}>
        <h3 className="mono-text text-purple">&lt;Tech_Arsenal /&gt;</h3>
      </div>
      <div style={{ position: 'relative', width: '100vw', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw', display: 'flex' }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          style={{ display: 'flex', whiteSpace: 'nowrap' }}
        >
          {/* Double the array for seamless looping */}
          {[...stack, ...stack].map((tech, i) => (
            <span 
              key={i} 
              style={{ 
                fontSize: 'clamp(3rem, 8vw, 6rem)', 
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                textTransform: 'uppercase',
                padding: '0 2rem',
                color: i % 2 === 0 ? 'transparent' : 'var(--text-main)',
                WebkitTextStroke: i % 2 === 0 ? '2px var(--text-muted)' : 'none',
                lineHeight: 1
              }}
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
