import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/dist/ScrollSmoother';

gsap.registerPlugin(ScrollSmoother);

export default function GSAPScrollSmoother() {
  useEffect(() => {
    // Initialize GSAP ScrollSmoother for smooth scroll
    const smoother = ScrollSmoother.create({
      smooth: 1.5, // Smoothing duration
      effects: true,
      normalizeScroll: true,
    });

    console.log('✅ GSAP ScrollSmoother initialized');

    return () => {
      // Cleanup
      smoother.kill();
    };
  }, []);

  return null;
}
