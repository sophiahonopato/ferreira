/**
 * Liga o scroll à narrativa 3D:
 *  - #historia (8 capítulos)  → stage 0 … 7
 *  - do conteúdo até o fim    → canvas oculto e pausado (o 3D não volta no rodapé)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience, setCanvasVisible } from '../lib/experienceStore';
import { STORY_END } from '../three/lib/stages';

gsap.registerPlugin(ScrollTrigger);

export function setupStoryScroll({ animateText = true } = {}) {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: '#historia',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { experience.stage = self.progress * STORY_END; },
    });

    // a partir das Áreas de Atuação o 3D sai de cena e não volta mais
    ScrollTrigger.create({
      trigger: '#conteudo',
      start: 'top 55%',
      onEnter: () => setCanvasVisible(0),
      onLeaveBack: () => setCanvasVisible(1),
    });

    // HERO: no scroll, logo + frase + menu sobem devagar, diminuem e somem juntos
    gsap.to('.hero__content', {
      y: () => window.innerHeight * 0.38, scale: 0.94, autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '#inicio', start: 'top top', end: '50% top', scrub: true, invalidateOnRefresh: true },
    });
    gsap.to('.hero__cue', {
      autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '#inicio', start: 'top top', end: '12% top', scrub: true },
    });

    if (animateText) {
      gsap.utils.toArray('.chapter__inner').forEach((el) => {
        gsap.from(el.querySelectorAll('.reveal'), {
          autoAlpha: 0,
          y: 22,
          duration: 1.1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none reverse' },
        });
      });
    }
  });
  return () => ctx.revert();
}