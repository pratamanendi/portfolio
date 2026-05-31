'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectCard3D({ children, href = '#', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(card, { opacity: 1, y: 0 });
        gsap.set(card.querySelectorAll('*'), { opacity: 1 });
        return;
      }

      // Scroll reveal
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(card, { y: 60, opacity: 0 }, {
            y: 0, opacity: 1,
            duration: 0.8,
            ease: 'power3.out'
          });
        },
        once: true,
      });

      // Mouse tilt - only on devices with actual hover
      if (!hasHover) return;

      const handleMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotationY: x * 8,
          rotationX: -y * 8,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleLeave = () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power3.out' });
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className={`project-card-3d ${className}`}
      style={{ display: 'block', transformStyle: 'preserve-3d' }}
    >
      {children}
    </a>
  );
}
