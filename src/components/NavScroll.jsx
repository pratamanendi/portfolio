'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function NavScroll() {
  const ref = useRef(null);

  useEffect(() => {
    const nav = ref.current?.parentElement;
    if (!nav) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80px',
        onUpdate: (self) => {
          const dir = self.direction; // -1 down, 1 up
          if (dir === -1 && window.scrollY > 80) {
            gsap.to(nav, { top: -nav.offsetHeight, duration: 0.3, ease: 'power2.out' });
          } else if (dir === 1 || window.scrollY < 80) {
            gsap.to(nav, { top: 0, duration: 0.3, ease: 'power2.out' });
          }
        },
      });

      // Extra nav strengthen when scrolled
      ScrollTrigger.create({
        start: 'top -40px',
        onEnter: () => gsap.to(nav, { backgroundColor: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(16px)', duration: 0.3 }),
        onLeaveBack: () => gsap.to(nav, { backgroundColor: 'rgba(5,5,5,0.95)', backdropFilter: 'blur(16px)', duration: 0.3 }),
      });
    }, nav);
    return () => ctx.revert();
  }, []);

  return <span ref={ref} style={{ display: 'none' }} />;
}
