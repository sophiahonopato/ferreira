import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { dustShape } from '../lib/shapes';
import { runtime } from '../lib/runtime';

/** Poeira de fundo, muito discreta: só profundidade. */
export default function Dust({ count = 260 }) {
  const ref = useRef();
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(dustShape(count), 3));
    return g;
  }, [count]);
  useFrame(() => {
    ref.current.rotation.y = runtime.time * 0.006 + runtime.s * 0.03;
    ref.current.position.y = runtime.s * 0.08;
  });
  return (
    <points ref={ref} geometry={geo} renderOrder={0}>
      <pointsMaterial color="#6D8597" size={0.028} sizeAttenuation transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}
