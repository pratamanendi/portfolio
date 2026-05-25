// Lenis smooth scroll init - direct inline for SSG
(function() {
  'use strict';
  
  // Wait for DOM ready
  function initLenis() {
    console.log('🚀 Lenis init starting...');
    
    try {
      // Dynamically load Lenis from CDN with proper error handling
      const script1 = document.createElement('script');
      script1.type = 'importmap';
      script1.textContent = JSON.stringify({
        imports: {
          'lenis': 'https://cdn.jsdelivr.net/npm/lenis@1.1.9/dist/lenis.es.js',
          'gsap': 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/gsap.js',
          'gsap/ScrollTrigger': 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/dist/ScrollTrigger.js'
        }
      });
      document.head.appendChild(script1);
      
      const script2 = document.createElement('script');
      script2.type = 'module';
      script2.textContent = `
        import Lenis from 'lenis';
        import gsap from 'gsap';
        import ScrollTrigger from 'gsap/ScrollTrigger';

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

        // Link with GSAP
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        window.lenis = lenis;
        console.log('✅ Lenis smooth scroll activated!');
      `;
      document.head.appendChild(script2);
      
    } catch (error) {
      console.error('❌ Lenis error:', error);
    }
  }

  // Check DOM ready state
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLenis);
  } else {
    initLenis();
  }
})();
