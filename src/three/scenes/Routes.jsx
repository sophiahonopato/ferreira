/**
 * Pontos de localização e rotas saindo do Brasil.
 * As mesmas rotas existem no mapa plano e no globo: a geometria é recalculada
 * a cada frame misturando as duas projeções, para acompanhar a metamorfose.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime } from '../lib/runtime';
import { HUB, DESTINATIONS, clamp01, ease } from '../lib/stages';
import { mapXY, sphereXYZ, GLOBE_R } from '../lib/shapes';

const SEG = 64;
const v = new THREE.Vector3();

function projected(lon, lat, s) {
  // s < 5: do mapa pequeno (dentro do documento) ao mapa cheio; 5→6: mapa → globo
  const mini = mapXY(lon, lat, 1.9, 0.95); mini[1] += 0.1;
  const full = mapXY(lon, lat);
  const sph = sphereXYZ(lon, lat);
  if (s < 5) {
    const m = ease(clamp01(s - 4));
    return [mini[0] + (full[0] - mini[0]) * m, mini[1] + (full[1] - mini[1]) * m, 0.02];
  }
  const g = ease(clamp01(s - 5));
  return [full[0] + (sph[0] - full[0]) * g, full[1] + (sph[1] - full[1]) * g, 0.02 + (sph[2] - 0.02) * g];
}

function arcPoint(a, b, t, s, out) {
  // curva plana (mapa)
  const lift = Math.sin(Math.PI * t);
  const dist = Math.hypot(b.map[0] - a.map[0], b.map[1] - a.map[1]);
  const mx = a.map[0] + (b.map[0] - a.map[0]) * t;
  const my = a.map[1] + (b.map[1] - a.map[1]) * t + lift * dist * 0.18;
  const mz = 0.02 + lift * dist * 0.12;
  // arco de grande círculo (globo)
  const A = new THREE.Vector3(...a.sph).normalize();
  const B = new THREE.Vector3(...b.sph).normalize();
  const ang = A.angleTo(B);
  const sa = Math.sin(ang) || 1e-4;
  v.copy(A).multiplyScalar(Math.sin((1 - t) * ang) / sa).addScaledVector(B, Math.sin(t * ang) / sa);
  v.multiplyScalar(GLOBE_R * (1.005 + lift * ang * 0.16));
  const g = ease(clamp01(s - 5));
  const mini = s < 5 ? 1 - ease(clamp01(s - 4)) : 0;
  const k = 1 - mini * (1 - 1.9 / 5.6); // encolhe no mini-mapa
  out[0] = (mx * k) * (1 - g) + v.x * g;
  out[1] = (my * k + mini * 0.1) * (1 - g) + v.y * g;
  out[2] = mz * (1 - g) + v.z * g;
}

export default function Routes() {
  const pinsRef = useRef();
  const pinMat = useRef();
  const lines = useRef([]);

  const all = useMemo(() => [HUB, ...DESTINATIONS], []);
  const pinGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(all.length * 3), 3));
    return g;
  }, [all]);
  const lineGeos = useMemo(
    () => DESTINATIONS.map(() => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array((SEG + 1) * 3), 3));
      return g;
    }),
    [],
  );

  useFrame(() => {
    const s = runtime.s;
    // aparecem no documento (4.3), vivem no mapa e no globo, somem rumo à arquitetura
    const vis = clamp01((s - 4.3) / 0.4) * clamp01((6.7 - s) / 0.35);
    pinsRef.current.visible = vis > 0.01;
    lines.current.forEach((l) => l && (l.visible = vis > 0.01));
    if (vis <= 0.01) return;

    const pos = pinGeo.attributes.position.array;
    all.forEach((c, i) => pos.set(projected(c.lon, c.lat, s), i * 3));
    pinGeo.attributes.position.needsUpdate = true;
    pinMat.current.opacity = vis;

    const hub = { map: mapXY(HUB.lon, HUB.lat), sph: sphereXYZ(HUB.lon, HUB.lat) };
    const tmp = [0, 0, 0];
    DESTINATIONS.forEach((d, i) => {
      const b = { map: mapXY(d.lon, d.lat), sph: sphereXYZ(d.lon, d.lat) };
      // cada rota se desenha em sequência: os pontos "começam a se conectar"
      const draw = clamp01((s - 4.55 - i * 0.07) / 0.5);
      const arr = lineGeos[i].attributes.position.array;
      for (let j = 0; j <= SEG; j++) {
        arcPoint(hub, b, j / SEG, s, tmp);
        arr[j * 3] = tmp[0]; arr[j * 3 + 1] = tmp[1]; arr[j * 3 + 2] = tmp[2];
      }
      lineGeos[i].attributes.position.needsUpdate = true;
      lineGeos[i].setDrawRange(0, Math.floor(draw * SEG) + 1);
      const l = lines.current[i];
      if (l) l.material.opacity = vis * 0.75;
    });
  });

  return (
    <group>
      <points ref={pinsRef} geometry={pinGeo} frustumCulled={false} renderOrder={3}>
        <pointsMaterial ref={pinMat} color="#E4C28E" size={0.075} sizeAttenuation transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      {lineGeos.map((g, i) => (
        <line key={i} ref={(el) => (lines.current[i] = el)} geometry={g} frustumCulled={false} renderOrder={3}>
          <lineBasicMaterial color="#C9A06A" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </line>
      ))}
    </group>
  );
}
