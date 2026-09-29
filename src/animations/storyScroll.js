/**
 * Liga o scroll à narrativa 3D:
 *  - #historia (8 capítulos)  → stage 0 … 7
 *  - seções de conteúdo       → canvas oculto e pausado
 *  - #encerramento            → stage 7 … 10 (o ciclo se fecha no logo)
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experience, setCanvasVisible } from '../lib/experienceStore';
import { STORY_END, LAST_STAGE } from '../three/lib/stages';

gsap.registerPlugin(ScrollTrigger);

export function setupStoryScroll({ animateText = true } = {}) {
  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: '#historia',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { experience.stage = self.progress * STORY_END; },
    });

    ScrollTrigger.create({
      trigger: '#conteudo',
      start: 'top 55%',
      end: 'bottom 45%',
      onToggle: (self) => setCanvasVisible(self.isActive ? 0 : 1),
    });

    ScrollTrigger.create({
      trigger: '#encerramento',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        experience.stage = STORY_END + self.progress * (LAST_STAGE - STORY_END);
      },
    });

    // assinatura final aparece quando o logo se recompõe
    gsap.fromTo('.outro__sign', { autoAlpha: 0, y: 16 }, {
      autoAlpha: 1, y: 0, ease: 'none',
      scrollTrigger: { trigger: '#encerramento', start: '78% bottom', end: 'bottom bottom', scrub: true },
    });

    // abertura: a marca se revela junto com as partículas
    if (animateText) gsap.from('.hero__reveal', { autoAlpha: 0, y: 18, duration: 1.4, ease: 'power3.out', stagger: 0.12, delay: 1.2 });

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
