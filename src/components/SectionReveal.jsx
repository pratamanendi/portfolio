'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SectionReveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Reveal children with stagger
      const items = el.querySelectorAll('.reveal-item');
      if (items.length) {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => {
            gsap.fromTo(items, { y: 40, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out'
            });
          },
          once: true,
        });
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          onEnter: () => {
            gsap.fromTo(el, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
          },
          once: true,
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
