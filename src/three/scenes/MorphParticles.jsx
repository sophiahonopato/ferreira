import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { particleVertex, particleFragment } from '../lib/particleShader';
import { runtime } from '../lib/runtime';
import { LAST_STAGE, near } from '../lib/stages';
import { rng } from '../lib/shapes';

// Caixa aproximada do território brasileiro (destaque no mapa e no globo)
const isBrazil = (lon, lat) =>
  lon > -74 && lon < -34.5 && lat > -34 && lat < 5.5 &&
  !(lon < -67 && lat < -20) && !(lon > -60 && lat > 2) && !(lon < -58 && lat < -30);

export default function MorphParticles({ N, targets, land, size, calm = false }) {
  const matRef = useRef();
  const current = useRef(-1);
  const { viewport } = useThree();

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const r = rng(97);
    const rand = new Float32Array(N);
    const accent = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      rand[i] = r();
      accent[i] = isBrazil(land.lon[i], land.lat[i]) ? 1 : 0;
    }
    g.setAttribute('position', new THREE.BufferAttribute(targets[0].slice(), 3));
    g.setAttribute('aFrom', new THREE.BufferAttribute(targets[0].slice(), 3));
    g.setAttribute('aTo', new THREE.BufferAttribute(targets[1].slice(), 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    g.setAttribute('aAccent', new THREE.BufferAttribute(accent, 1));
    return g;
  }, [N, targets, land]);

  const uniforms = useMemo(() => ({
    uT: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: size },
    uPixelRatio: { value: 1 },
    uScatter: { value: calm ? 0 : 0.22 },
    uMotion: { value: calm ? 0 : 1 },
    uAccent: { value: 0 },
    uIntro: { value: calm ? 1 : 0 },
    uOpacity: { value: 0.8 },
    uPaper: { value: new THREE.Color('#ECE6DA') },
    uBrass: { value: new THREE.Color('#C9A06A') },
    uSteel: { value: new THREE.Color('#7F97A8') },
  }), [size, calm]);

  useFrame((_, dt) => {
    const s = Math.min(Math.max(runtime.s, 0), LAST_STAGE);
    const k = Math.min(Math.floor(s), LAST_STAGE - 1);
    if (k !== current.current) {
      geometry.attributes.aFrom.array.set(targets[k]);
      geometry.attributes.aTo.array.set(targets[k + 1]);
      geometry.attributes.aFrom.needsUpdate = true;
      geometry.attributes.aTo.needsUpdate = true;
      current.current = k;
    }
    const u = matRef.current.uniforms;
    u.uIntro.value = Math.min(1, u.uIntro.value + Math.min(dt, 0.05) / 2.6);
    u.uT.value = s - k;
    u.uTime.value = runtime.time;
    u.uPixelRatio.value = viewport.dpr;
    // Brasil ganha destaque do mapa ao globo
    u.uAccent.value = Math.max(near(s, 5, 1.2), near(s, 6, 1.2), near(s, 8, 0.8) * 0.6);
  });

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={2}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
