import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerSmoothScroll } from '../lib/scroll';

gsap.registerPlugin(ScrollTrigger);

export function startSmoothScroll() {
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const raf = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  registerSmoothScroll(lenis);
  return () => {
    gsap.ticker.remove(raf);
    registerSmoothScroll(null);
    lenis.destroy();
  };
}
