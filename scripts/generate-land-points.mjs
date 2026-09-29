/**
 * Gera pontos distribuídos uniformemente sobre os continentes (Natural Earth 110m).
 * Saída: src/data/landPoints.json -> array plano [lon, lat, lon, lat, ...]
 * Rodar só quando quiser mudar a densidade: `npm run generate:land`
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-110m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

const SAMPLES = 22000; // pontos na esfera inteira (≈29% caem em terra)
const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < SAMPLES; i++) {
  const y = 1 - (i / (SAMPLES - 1)) * 2;
  const lat = Math.asin(y) * 180 / Math.PI;
  const lon = ((((i * golden) * 180 / Math.PI) % 360) + 540) % 360 - 180;
  if (lat < -60) continue; // Antártida fora: poluiria a leitura do mapa
  if (geoContains(land, [lon, lat])) out.push(+lon.toFixed(2), +lat.toFixed(2));
}
writeFileSync(new URL('../src/data/landPoints.json', import.meta.url), JSON.stringify(out));
console.log('land points:', out.length / 2);
