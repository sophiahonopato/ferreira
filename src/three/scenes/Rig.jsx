/**
 * Câmera cinematográfica controlada pelo scroll + transformações do grupo.
 * Também adapta o enquadramento a telas estreitas (mobile/tablet em retrato).
 */
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime, tickRuntime } from '../lib/runtime';
import { KEYFRAMES, LAST_STAGE, clamp01, ease, near } from '../lib/stages';

const lerp = (a, b, t) => a + (b - a) * t;
const look = new THREE.Vector3();

export default function Rig({ groupRef, parallax = true, calm = false }) {
  const { camera, size } = useThree();

  useFrame((state, dt) => {
    tickRuntime(Math.min(dt, 0.05), state.clock.elapsedTime);
    const s = Math.min(Math.max(runtime.s, 0), LAST_STAGE);
    const k = Math.min(Math.floor(s), LAST_STAGE - 1);
    const t = ease(s - k);
    const A = KEYFRAMES[k], B = KEYFRAMES[k + 1];

    const aspect = size.width / size.height;
    // objetos têm ~3.4 unidades de largura: afasta a câmera em telas estreitas
    const fit = aspect < 1 ? Math.min(2.1, 0.95 / aspect ** 0.85) : 1;
    // no desktop o objeto se desloca para o lado oposto ao texto
    const sideAmt = aspect > 1.15 ? Math.min(1.5, (aspect - 1) * 1.6) : 0;
    const mobileLift = aspect < 1 ? 0.6 + (fit - 1) * 0.5 : 0; // texto fica embaixo no mobile

    const px = parallax ? runtime.px : 0, py = parallax ? runtime.py : 0;
    camera.position.set(
      lerp(A.cam[0], B.cam[0], t) + px * 0.25,
      lerp(A.cam[1], B.cam[1], t) - py * 0.15 - mobileLift,
      lerp(A.cam[2], B.cam[2], t) * fit,
    );
    look.set(lerp(A.look[0], B.look[0], t), lerp(A.look[1], B.look[1], t) - mobileLift, lerp(A.look[2], B.look[2], t));
    camera.lookAt(look);

    const g = groupRef.current;
    if (!g) return;
    // giro do globo: acelera ao entrar, desacelera ao virar arquitetura
    // Brasil de frente quando o globo se forma; giro lento depois
    const spin = Math.sin(clamp01((s - 5.6) / 1.4) * Math.PI) * 0.55
      + (calm ? 0 : 0.12 * Math.sin(runtime.time * 0.22) * near(s, 6)
        + 0.6 * Math.sin(runtime.time * 0.3) * near(s, 8, 0.6));
    g.rotation.x = lerp(A.rot[0], B.rot[0], t) + py * 0.05;
    g.rotation.y = lerp(A.rot[1], B.rot[1], t) + spin + px * 0.08;
    g.position.x = -lerp(A.side, B.side, t) * sideAmt;
  });

  return null;
}
