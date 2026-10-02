/**
 * Linha do tempo da narrativa. O scroll produz um número contínuo `stage` (0 → 10).
 * Entre dois estágios inteiros, as partículas se interpolam (metamorfose).
 *
 *  0 logo · 1 envelope · 2 envelope aberto · 3 documento · 4 documento+mapa
 *  5 mapa · 6 globo · 7 arquitetura · 8 globo recolhido · 9 envelope fechado · 10 logo
 */
import {
  logoShape, envelopeShape, documentShape, docMapShape, mapShape,
  globeShape, brasiliaShape,
} from './shapes';

export const STAGE = {
  LOGO: 0, ENVELOPE: 1, ENVELOPE_OPEN: 2, DOCUMENT: 3, DOC_MAP: 4,
  MAP: 5, GLOBE: 6, BRASILIA: 7, GLOBE_SMALL: 8, ENVELOPE_SMALL: 9, LOGO_END: 10,
};
export const LAST_STAGE = 10;
export const STORY_END = STAGE.BRASILIA; // fim do primeiro bloco narrativo

export function buildTargets(N, land, logoImage) {
  const logo = logoShape(N, { image: logoImage });
  return [
    envelopeShape(N, { open: 0 }), // Hero: as partículas já surgem como o envelope do capítulo 1
    envelopeShape(N, { open: 0 }),
    envelopeShape(N, { open: 1 }),
    documentShape(N),
    docMapShape(N, land),
    mapShape(N, land),
    globeShape(N, land),
    brasiliaShape(N),
    globeShape(N, land, 0.7),
    envelopeShape(N, { open: 0, scale: 0.45 }),
    logo,
  ];
}

/**
 * Câmera e grupo por estágio.
 * cam: posição · look: alvo · rot: [x, y] do grupo · side: lado do texto (desloca o objeto)
 */
export const KEYFRAMES = [
  { cam: [0, -0.15, 7.2], look: [0, -0.15, 0], rot: [0, -0.12], side: -1 },
  { cam: [0, 0, 6.9], look: [0, 0, 0], rot: [-0.32, 0.42], side: -1 },
  { cam: [0, 0.35, 7.5], look: [0, 0.3, 0], rot: [-0.18, -0.3], side: 1 },
  { cam: [0, 0, 6.8], look: [0, 0, 0], rot: [-0.08, 0.22], side: -1 },
  { cam: [0, 0, 6.3], look: [0, 0, 0], rot: [-0.05, -0.08], side: 1 },
  { cam: [0, -0.3, 8.6], look: [0, 0, 0], rot: [-0.5, -0.12], side: -1.1 },
  { cam: [0, 0, 7.3], look: [0, 0, 0], rot: [-0.28, 0], side: 1 },
  { cam: [1.7, 1.3, 8.6], look: [0, -0.2, 0], rot: [0, -0.3], side: -1.1 },
  { cam: [0, 0, 6.6], look: [0, -0.5, 0], rot: [-0.28, 0], side: 0 },
  { cam: [0, 0, 6.6], look: [0, -0.5, 0], rot: [-0.2, 0.3], side: 0 },
  { cam: [0, 0, 6.8], look: [0, -0.8, 0], rot: [0, 0], side: 0 },
];

/** Conexões internacionais (origem: São Paulo). Sem sugerir escritórios próprios. */
export const HUB = { name: 'São Paulo', lon: -46.63, lat: -23.55 };
export const DESTINATIONS = [
  { name: 'Nova York', lon: -74.0, lat: 40.7 },
  { name: 'Miami', lon: -80.19, lat: 25.76 },
  { name: 'Lisboa', lon: -9.14, lat: 38.72 },
  { name: 'Madri', lon: -3.7, lat: 40.42 },
  { name: 'Londres', lon: -0.13, lat: 51.5 },
  { name: 'Tóquio', lon: 139.69, lat: 35.69 },
];

export const clamp01 = (v) => Math.min(1, Math.max(0, v));
export const ease = (t) => t * t * (3 - 2 * t);
/** Peso de proximidade a um estágio (1 exatamente nele, 0 a 1 estágio de distância). */
export const near = (s, k, width = 1) => clamp01(1 - Math.abs(s - k) / width);
