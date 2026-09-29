/**
 * Corpo do globo: esfera escura que oculta o hemisfério de trás (profundidade real)
 * + halo de fresnel discreto. Só existe enquanto as partículas formam uma esfera.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime } from '../lib/runtime';
import { GLOBE_R } from '../lib/shapes';
import { near } from '../lib/stages';

const haloVertex = /* glsl */ `
  varying vec3 vN; varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`;
const haloFragment = /* glsl */ `
  uniform float uOpacity; uniform vec3 uColor;
  varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(1.0 - max(dot(vN, vV), 0.0), 4.0);
    gl_FragColor = vec4(uColor, f * uOpacity);
  }`;

export default function GlobeShell({ halo = true }) {
  const group = useRef();
  const body = useRef();
  const haloMat = useRef();
  const uniforms = useMemo(() => ({ uOpacity: { value: 0 }, uColor: { value: new THREE.Color('#8FA9BC') } }), []);

  useFrame(() => {
    const s = runtime.s;
    const big = near(s, 6, 0.45);
    const small = near(s, 8, 0.45);
    const w = Math.max(big, small);
    group.current.visible = w > 0.02;
    if (!group.current.visible) return;
    const scale = big >= small ? 1 : 0.7 / GLOBE_R;
    group.current.scale.setScalar(scale * (0.96 + 0.04 * w));
    body.current.material.opacity = w;
    if (haloMat.current) haloMat.current.uniforms.uOpacity.value = w * 0.55;
  });

  return (
    <group ref={group}>
      <mesh ref={body} renderOrder={1}>
        <sphereGeometry args={[GLOBE_R * 0.985, 64, 48]} />
        <meshBasicMaterial color="#0D1B27" transparent opacity={0} />
      </mesh>
      {halo && (
        <mesh scale={1.08} renderOrder={4}>
          <sphereGeometry args={[GLOBE_R, 64, 48]} />
          <shaderMaterial ref={haloMat} vertexShader={haloVertex} fragmentShader={haloFragment} uniforms={uniforms}
            transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      )}
    </group>
  );
}
