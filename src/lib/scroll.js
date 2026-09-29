/**
 * Navegação por âncora, sem dependências pesadas.
 * Se o scroll suave (Lenis) estiver ativo, ele se registra aqui.
 */
let smooth = null;
export const registerSmoothScroll = (instance) => { smooth = instance; };

/** Trava o scroll da página (menu aberto), com ou sem scroll suave. */
export function setScrollLocked(locked) {
  document.documentElement.classList.toggle('menu-open', locked);
  if (smooth) locked ? smooth.stop() : smooth.start();
}

export function scrollToHash(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const header = document.querySelector('.site-header')?.offsetHeight ?? 0;
  const focus = () => {
    el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  if (smooth) smooth.scrollTo(el, { offset: -header, duration: 1.4, onComplete: focus });
  else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - header, behavior: reduce ? 'auto' : 'smooth' });
    focus();
  }
  history.replaceState(null, '', hash);
}
