import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal({ children, className = '', duration = 0.8, delay = 0 }) {
  const elementRef = React.useRef(null);

  React.useEffect(() => {
    if (!elementRef.current) return;

    gsap.fromTo(
      elementRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: elementRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: false,
          markers: false,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [duration, delay]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
