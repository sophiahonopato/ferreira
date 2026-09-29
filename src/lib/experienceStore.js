/**
 * Estado compartilhado entre o DOM (scroll) e o WebGL (useFrame),
 * mutável de propósito: evita re-render do React a cada frame.
 */
export const experience = {
  stage: 0,          // alvo vindo do scroll (0 → 10)
  visible: 1,        // opacidade alvo do canvas (0 nas seções de conteúdo)
  pointer: { x: 0, y: 0 },
  listeners: new Set(),
};

export function setCanvasVisible(v) {
  if (experience.visible === v) return;
  experience.visible = v;
  experience.listeners.forEach((fn) => fn(v));
}

export function onVisibilityChange(fn) {
  experience.listeners.add(fn);
  return () => experience.listeners.delete(fn);
}
