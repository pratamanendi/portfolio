// Lenis smooth scroll initialization
(async () => {
  try {
    const { default: Lenis } = await import('https://cdn.jsdelivr.net/npm/lenis@1.1.9');
    const { default: gsap } = await import('https://cdn.jsdelivr.net/npm/gsap@3.12.2');

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

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    window.lenis = lenis;
    console.log('✅ Lenis smooth scroll activated!');
  } catch (error) {
    console.warn('❌ Lenis init failed:', error.message);
  }
})();
