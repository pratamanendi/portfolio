'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal({ text, as = 'p', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll('.char');
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => {
          gsap.to(chars, {
            y: 0, opacity: 1, duration: 0.6,
            stagger: 0.03, ease: 'power3.out'
          });
        },
        once: true,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const Tag = as;

  return (
    <Tag ref={ref} className={className}>
      {text.split('').map((c, i) => (
        <span
          key={i}
          className="char"
          style={{ transform: 'translateY(40px)', opacity: 0, display: 'inline-block' }}
        >
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </Tag>
  );
}
