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

    // Use the hero section as scope root
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const ctx = gsap.context(() => {
      // Stagger load-in
      gsap.from('.hero-eyebrow', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      gsap.from('.hero-title-line', { y: 60, opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
      gsap.from('.hero-sub', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.9 });
      gsap.from('.hero-cta', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 1.2 });
      gsap.from('.hero-scroll-hint', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 1.8 });

      // Hero parallax on scroll
      gsap.to('.hero-content', {
        y: '20%', scale: 0.95,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.5 }
      });
    }, hero); // scope to hero section
    return () => ctx.revert();
  }, []);

  return <span ref={ref} style={{ display: 'none' }} />;
}
