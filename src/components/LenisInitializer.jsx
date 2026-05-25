import { useEffect } from 'react';

export default function LenisInitializer() {
  useEffect(() => {
    const initLenis = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { default: Lenis } = await import('lenis');
        const { default: gsap } = await import('gsap');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          direction: 'vertical',
          gestureDirection: 'vertical',
          smooth: true,
          mouseMultiplier: 1,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        window.lenis = lenis;
        console.log('✅ Lenis smooth scroll activated!');

        return () => {
          lenis.destroy();
        };
      } catch (error) {
        console.error('❌ Lenis init error:', error);
      }
    };

    initLenis();
  }, []);

  return null;
}
