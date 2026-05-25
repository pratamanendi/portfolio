import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgressBar() {
  const progressRef = React.useRef(null);

  React.useEffect(() => {
    const updateProgress = () => {
      if (!progressRef.current) return;

      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = scrollHeight ? (scrolled / scrollHeight) * 100 : 0;

      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.1,
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      ref={progressRef}
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 z-50 transition-all"
      style={{ width: '0%' }}
    />
  );
}
