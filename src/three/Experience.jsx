/**
 * Canvas WebGL persistente (fixo atrás do conteúdo).
 * Carregado sob demanda (React.lazy): quem não tem WebGL nunca baixa o Three.js.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { getLand } from './lib/shapes';
import { buildTargets } from './lib/stages';
import { onVisibilityChange, experience } from '../lib/experienceStore';
import { BRAND } from '../data/site';
import MorphParticles from './scenes/MorphParticles';
import Routes from './scenes/Routes';
import GlobeShell from './scenes/GlobeShell';
import Rig from './scenes/Rig';
import Dust from './scenes/Dust';

const TIER = {
  high: { N: 5799, dpr: [1, 1.75], size: 34, dust: 320, halo: true, parallax: true },
  medium: { N: 3600, dpr: [1, 1.5], size: 42, dust: 180, halo: true, parallax: false },
  low: { N: 2200, dpr: [1, 1.25], size: 50, dust: 0, halo: false, parallax: false },
};

function loadImage(src) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

export default function Experience({ tier = 'high', calm = false, onFail }) {
  const cfg = TIER[tier];
  const groupRef = useRef();
  const [targets, setTargets] = useState(null);
  const [active, setActive] = useState(experience.visible > 0);
  const [dpr, setDpr] = useState(cfg.dpr[1]);
  const land = useMemo(() => getLand(cfg.N), [cfg.N]);

  useEffect(() => {
    let alive = true;
    (async () => {
      // espera a fonte do monograma para amostrar o logo corretamente
      await Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 1500))]);
      const logo = BRAND.logoSrc ? await loadImage(BRAND.logoSrc) : null;
      if (alive) setTargets(buildTargets(cfg.N, land, logo));
    })();
    return () => { alive = false; };
  }, [cfg.N, land]);

  // pausa o render quando o canvas está oculto (seções de conteúdo)
  useEffect(() => onVisibilityChange((v) => {
    if (v) setActive(true);
    else setTimeout(() => experience.visible === 0 && setActive(false), 900);
  }), []);

  return (
    <Canvas
      className="webgl"
      aria-hidden="true"
      dpr={dpr}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 35, near: 0.1, far: 60, position: [0, 0, 6.4] }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        // GPU reiniciada/driver instável: volta para a versão estática
        gl.domElement.addEventListener('webglcontextlost', (e) => { e.preventDefault(); onFail?.('contexto WebGL perdido (GPU reiniciou)'); }, { once: true });
      }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(cfg.dpr[1])} />
      {cfg.dust > 0 && <Dust count={cfg.dust} />}
      <group ref={groupRef}>
        {targets && <MorphParticles N={cfg.N} targets={targets} land={land} size={cfg.size} calm={calm} />}
        <GlobeShell halo={cfg.halo} />
        <Routes />
      </group>
      <Rig groupRef={groupRef} parallax={cfg.parallax && !calm} calm={calm} />
    </Canvas>
  );
}
