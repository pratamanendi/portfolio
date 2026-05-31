'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroAnimations() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    const ctx = gsap.context(() => {
      // Reduced motion check — skip if user prefers no motion
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) {
        // Just show everything instantly
        gsap.set('.hero-eyebrow, .hero-title-line, .hero-sub, .hero-cta', {
          opacity: 1, y: 0
        });
        return;
      }

      // Emil Kowalski: stagger load-in with custom ease
      gsap.from('.hero-eyebrow', {
        y: 40, opacity: 0, duration: 1,
        ease: 'power3.out', delay: 0.2
      });
      gsap.from('.hero-title-line', {
        y: 60, opacity: 0, duration: 1.2,
        stagger: 0.15, ease: 'power3.out', delay: 0.3
      });
      gsap.from('.hero-sub', {
        y: 40, opacity: 0, duration: 1,
        ease: 'power3.out', delay: 0.9
      });
      gsap.from('.hero-cta', {
        y: 30, opacity: 0, duration: 0.8,
        ease: 'power3.out', delay: 1.2
      });

      // Hero parallax on scroll
      gsap.to('.hero-content', {
        y: '20%', scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5
        }
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  return <span ref={ref} style={{ display: 'none' }} />;
}
