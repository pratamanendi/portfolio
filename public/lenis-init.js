// Lenis smooth scroll initialization - SSG compatible
(async function initLenis() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLenis);
  } else {
    setupLenis();
  }

  async function setupLenis() {
    try {
      console.log('🚀 Starting Lenis initialization...');
      
      const { default: Lenis } = await import('https://cdn.jsdelivr.net/npm/lenis@1.1.9/+esm');
      const { default: gsap } = await import('https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm');
      const { ScrollTrigger } = await import('https://cdn.jsdelivr.net/npm/gsap@3.12.2/ScrollTrigger.js/+esm');

      console.log('✓ Modules imported');

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

      console.log('✓ Lenis instance created');

      // Link Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);
      
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);

      // Store in window for debugging
      window.lenis = lenis;
      console.log('✅ Lenis smooth scroll activated!');
    } catch (error) {
      console.error('❌ Lenis init failed:', error);
    }
  }
})();
