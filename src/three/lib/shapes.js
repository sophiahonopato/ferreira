/**
 * Geradores de posições-alvo. Cada função devolve Float32Array(N * 3).
 * A partícula i é SEMPRE a mesma entre cenas — é isso que cria a metamorfose.
 * A partícula i também está ligada ao ponto de terra i (lon/lat), usado no mapa e no globo.
 */
import landRaw from '../../data/landPoints.json';

export const LON0 = -50; // Brasil no centro do mapa e de frente para a câmera no globo
export const GLOBE_R = 1.6;
export const MAP_W = 5.6;
export const MAP_H = 2.8;

// PRNG determinístico: mesma forma em todo carregamento
export function rng(seed = 7) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Subamostra os pontos de terra para N partículas (tier do dispositivo). */
export function getLand(N) {
  const total = landRaw.length / 2;
  const lon = new Float32Array(N);
  const lat = new Float32Array(N);
  const step = total / N;
  for (let i = 0; i < N; i++) {
    const j = Math.floor(i * step) * 2;
    lon[i] = landRaw[j];
    lat[i] = landRaw[j + 1];
  }
  return { lon, lat };
}

const wrapLon = (lon) => ((lon - LON0 + 540) % 360) - 180;

export function mapXY(lon, lat, w = MAP_W, h = MAP_H) {
  return [(wrapLon(lon) / 180) * (w / 2), (lat / 90) * (h / 2)];
}

export function sphereXYZ(lon, lat, r = GLOBE_R) {
  const la = (lat * Math.PI) / 180;
  const lo = (wrapLon(lon) * Math.PI) / 180;
  return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
}

/* ---------- utilidades de amostragem ---------- */
function onSegment(r, a, b) {
  const t = r();
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, (a[2] ?? 0) + ((b[2] ?? 0) - (a[2] ?? 0)) * t];
}
function onPolyline(r, pts) {
  // escolhe segmento proporcional ao comprimento
  const lens = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1], (b[2] ?? 0) - (a[2] ?? 0));
    lens.push(l);
    total += l;
  }
  let pick = r() * total;
  for (let i = 0; i < lens.length; i++) {
    if (pick <= lens[i]) return onSegment(r, pts[i], pts[i + 1]);
    pick -= lens[i];
  }
  return onSegment(r, pts[0], pts[1]);
}
const rectLoop = (w, h, cx = 0, cy = 0, z = 0) => [
  [cx - w / 2, cy - h / 2, z], [cx + w / 2, cy - h / 2, z],
  [cx + w / 2, cy + h / 2, z], [cx - w / 2, cy + h / 2, z], [cx - w / 2, cy - h / 2, z],
];

/* ---------- 01. LOGO ---------- */
/**
 * Amostra pixels de um monograma desenhado em canvas.
 * Se BRAND.logoSrc existir, passe a imagem carregada em `image` para usar o logo oficial.
 */
export function logoShape(N, { image = null, text = 'PF' } = {}) {
  const W = 512, H = 300;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  if (image) {
    const s = Math.min((W * 0.9) / image.width, (H * 0.8) / image.height);
    g.drawImage(image, (W - image.width * s) / 2, (H - image.height * s) / 2, image.width * s, image.height * s);
  } else {
    g.font = '300 230px Spectral, Georgia, serif';
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    g.fillText(text, W / 2, 222);
    g.fillRect(W * 0.3, 262, W * 0.4, 3); // fio sob o monograma
  }
  const data = g.getImageData(0, 0, W, H).data;
  const filled = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3] > 128) filled.push(x, y);

  const r = rng(11);
  const out = new Float32Array(N * 3);
  const scale = 3.4 / W;
  const count = filled.length / 2;
  for (let i = 0; i < N; i++) {
    const k = Math.floor(r() * count) * 2;
    out[i * 3] = (filled[k] - W / 2) * scale + (r() - 0.5) * 0.012;
    out[i * 3 + 1] = -(filled[k + 1] - H / 2) * scale + (r() - 0.5) * 0.012;
    out[i * 3 + 2] = (r() - 0.5) * 0.16; // espessura: dá volume à luz
  }
  return out;
}

/* ---------- 02. ENVELOPE ---------- */
export function envelopeShape(N, { open = 0, scale = 1 } = {}) {
  const r = rng(23);
  const W = 3.0, H = 2.0;
  const top = H / 2, bot = -H / 2;
  const apexClosed = [0, 0.05, 0.02];
  // aberta: aba gira para cima (reflexo do vértice) e recua em z
  const apexOpen = [0, top + (top - 0.05) * 0.95, -0.35];
  const apex = [
    0,
    apexClosed[1] + (apexOpen[1] - apexClosed[1]) * open,
    apexClosed[2] + (apexOpen[2] - apexClosed[2]) * open,
  ];
  const flap = [[-W / 2, top, 0], apex, [W / 2, top, 0]];
  const lower = [[-W / 2, bot, 0], [0, -0.12, 0], [W / 2, bot, 0]];
  const doc = rectLoop(2.5, 1.9, 0, 0.6 + open * 0.55, -0.05);

  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = r();
    let p;
    if (u < 0.38) p = onPolyline(r, rectLoop(W, H));
    else if (u < 0.58) p = onPolyline(r, flap);
    else if (u < 0.72) p = onPolyline(r, lower);
    else if (open > 0 && u < 0.86) {
      // documento surgindo: só a parte acima da boca do envelope
      p = onPolyline(r, doc);
      if (p[1] < top) p = [p[0], top + r() * 0.5 * open, -0.05];
    } else p = [(r() - 0.5) * W, (r() - 0.5) * H, (r() - 0.5) * 0.02]; // superfície rarefeita
    out[i * 3] = p[0] * scale;
    out[i * 3 + 1] = p[1] * scale;
    out[i * 3 + 2] = p[2] * scale;
  }
  return out;
}

/* ---------- 03. DOCUMENTO ---------- */
function docPoint(r, W, H) {
  const u = r();
  const left = -W / 2 + 0.22;
  if (u < 0.3) return onPolyline(r, rectLoop(W, H));
  if (u < 0.4) {
    // título
    const y = H / 2 - 0.35;
    return [left + r() * (W * 0.55), y, 0];
  }
  if (u < 0.88) {
    // linhas de texto
    const rows = 15;
    const row = Math.floor(r() * rows);
    const y = H / 2 - 0.62 - row * ((H - 1.2) / rows);
    const len = row % 5 === 4 ? 0.45 : 0.78 + ((row * 37) % 17) / 100;
    return [left + r() * (W - 0.44) * len, y, 0];
  }
  // selo / assinatura
  const a = r() * Math.PI * 2;
  return [W / 2 - 0.5 + Math.cos(a) * 0.18, -H / 2 + 0.38 + Math.sin(a) * 0.18, 0];
}

export function documentShape(N) {
  const r = rng(31);
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const p = docPoint(r, 2.2, 3.0);
    out.set([p[0], p[1], (r() - 0.5) * 0.01], i * 3);
  }
  return out;
}

/* ---------- 04. DOCUMENTO → MAPA (o mapa nasce dentro do papel) ---------- */
export function docMapShape(N, land) {
  const r = rng(37);
  const out = new Float32Array(N * 3);
  const W = 2.2, H = 3.0;
  for (let i = 0; i < N; i++) {
    let p;
    if (i % 4 === 0) {
      // 1/4 das partículas continua sendo o papel
      p = r() < 0.6 ? onPolyline(r, rectLoop(W, H)) : docPoint(r, W, H);
      if (p[1] > -0.55 && p[1] < 0.75 && Math.abs(p[0]) < W / 2 - 0.01) p[1] += p[1] > 0.1 ? 0.7 : -0.7;
    } else {
      const [x, y] = mapXY(land.lon[i], land.lat[i], 1.9, 0.95);
      p = [x, y + 0.1, 0.01];
    }
    out.set(p, i * 3);
  }
  return out;
}

/* ---------- 05. MAPA ---------- */
export function mapShape(N, land) {
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const [x, y] = mapXY(land.lon[i], land.lat[i]);
    out.set([x, y, 0], i * 3);
  }
  return out;
}

/* ---------- 06. GLOBO ---------- */
export function globeShape(N, land, r = GLOBE_R) {
  const out = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) out.set(sphereXYZ(land.lon[i], land.lat[i], r), i * 3);
  return out;
}

/* ---------- 07. ARQUITETURA (abstração inspirada em Brasília) ---------- */
export function brasiliaShape(N) {
  const r = rng(53);
  const out = new Float32Array(N * 3);
  const base = -1.05;
  for (let i = 0; i < N; i++) {
    const u = r();
    let p;
    if (u < 0.2) {
      // esplanada: plataforma longa
      p = r() < 0.7
        ? onPolyline(r, [[-2.4, base, -0.7], [2.4, base, -0.7], [2.4, base, 0.7], [-2.4, base, 0.7], [-2.4, base, -0.7]])
        : [(r() - 0.5) * 4.8, base, (r() - 0.5) * 1.4];
    } else if (u < 0.48) {
      // lâminas verticais gêmeas
      const side = r() < 0.5 ? -1 : 1;
      const cx = side * 0.2, w = 0.3, h = 2.3, d = 0.12;
      if (r() < 0.55) {
        p = onPolyline(r, [[cx - w / 2, base, 0], [cx - w / 2, base + h, 0], [cx + w / 2, base + h, 0], [cx + w / 2, base, 0]]);
      } else {
        // pavimentos
        const f = Math.floor(r() * 18);
        p = [cx + (r() - 0.5) * w, base + 0.12 * f + 0.1, (r() - 0.5) * d];
      }
      if (r() < 0.08) p = [(r() - 0.5) * 0.4, base + 1.55, 0]; // passarela entre as lâminas
    } else if (u < 0.63) {
      // cúpula
      const a = r() * Math.PI * 2, b = Math.acos(r());
      const R = 0.5;
      p = [-1.35 + R * Math.sin(b) * Math.cos(a), base + R * Math.cos(b) * 0.9, R * Math.sin(b) * Math.sin(a)];
    } else if (u < 0.86) {
      // cuba invertida (tigela)
      const a = r() * Math.PI * 2, t = r();
      const R = 0.2 + t * 0.62;
      p = [1.35 + R * Math.cos(a), base + t * t * 0.55, R * Math.sin(a) * 0.9];
    } else {
      // colunata em curvas (arcos de linha, sem réplica literal)
      const k = Math.floor(r() * 7);
      const x0 = -1.75 + k * 0.5;
      const t = r();
      const x = x0 + t * 0.5;
      const y = base + 0.38 * Math.sin(Math.PI * t) ** 0.6;
      p = [x, y, 1.05];
    }
    out.set(p, i * 3);
  }
  return out;
}

/* ---------- partículas de ambiente (profundidade) ---------- */
export function dustShape(M) {
  const r = rng(71);
  const out = new Float32Array(M * 3);
  for (let i = 0; i < M; i++) out.set([(r() - 0.5) * 16, (r() - 0.5) * 10, -2 - r() * 8], i * 3);
  return out;
}
