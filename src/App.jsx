import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import ErrorBoundary3D from './components/ErrorBoundary3D';
import Story from './sections/Story';
import Areas from './sections/Areas';
import Team from './sections/Team';
import Location from './sections/Location';
import Contact from './sections/Contact';
import Outro from './sections/Outro';
import Footer from './sections/Footer';
import { useReducedMotion } from './hooks/useReducedMotion';
import { detectTier } from './hooks/useDeviceTier';
import Diagnostics from './components/Diagnostics';
import { experience, onVisibilityChange } from './lib/experienceStore';
import { EXPERIENCE } from './data/site';

// code splitting: Three.js só é baixado se o 3D for usado
const Experience = lazy(() => import('./three/Experience'));

export default function App() {
  const reduced = useReducedMotion();
  const tier = useMemo(detectTier, []);
  const [failed3D, setFailed3D] = useState(false);
  const onFail3D = useCallback((msg) => setFailed3D(msg || true), []);
  const calm = reduced && EXPERIENCE.reducedMotion === 'calm';
  const with3D = tier !== 'none' && !failed3D && (!reduced || calm);
  const layerRef = useRef(null);

  // canvas some nas seções de conteúdo (e o render pausa dentro do Experience)
  useEffect(() => onVisibilityChange((v) => layerRef.current?.classList.toggle('is-hidden', !v)), []);

  useEffect(() => {
    document.documentElement.classList.toggle('has-3d', with3D);
    if (!with3D) return;
    let cleanups = [];
    let cancelled = false;
    (async () => {
      const [{ startSmoothScroll }, { setupStoryScroll }] = await Promise.all([
        import('./animations/smoothScroll'),
        import('./animations/storyScroll'),
      ]);
      if (cancelled) return;
      // modo calmo: scroll nativo (sem inércia) e sem animação de textos
      if (!calm) cleanups.push(startSmoothScroll());
      cleanups.push(setupStoryScroll({ animateText: !calm }));
    })();
    const onMove = (e) => {
      experience.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      experience.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      window.removeEventListener('pointermove', onMove);
    };
  }, [with3D, calm]);

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <Header />
      {with3D && (
        <div ref={layerRef} className="webgl-layer" aria-hidden="true">
          <ErrorBoundary3D onFail={onFail3D}>
            <Suspense fallback={null}>
              <Experience tier={tier} calm={calm} onFail={onFail3D} />
            </Suspense>
          </ErrorBoundary3D>
        </div>
      )}
      <main id="conteudo-principal">
        <Story with3D={with3D} />
        <div id="conteudo" className="content">
          <Areas />
          <Team />
          <Location />
          <Contact />
        </div>
        <Outro with3D={with3D} />
      </main>
      <Footer />
      <Diagnostics tier={tier} reduced={reduced} calm={calm} failed3D={failed3D} with3D={with3D} />
    </>
  );
}
