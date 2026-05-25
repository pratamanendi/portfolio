import { useEffect } from 'react';

export default function LenisScroller() {
  useEffect(() => {
    // Dynamically load Lenis from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.umd.min.js';
    script.onload = () => {
      console.log('📦 Lenis library loaded');
      
      try {
        const lenis = new window.Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2,
        });

        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        console.log('✅ Lenis smooth scroll active');
        window.lenis = lenis;
      } catch (error) {
        console.error('❌ Lenis init failed:', error);
      }
    };
    
    script.onerror = () => {
      console.warn('⚠️ Failed to load Lenis CDN');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (window.lenis) {
        window.lenis.destroy();
      }
    };
  }, []);

  return null; // No DOM output needed
}
