/**
 * Hero + capítulos narrativos. Cada capítulo ocupa uma "tela" de scroll;
 * o texto é sempre HTML real (acessível e indexável), o 3D apenas o acompanha.
 */
import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { BRAND, CHAPTERS, HERO_NAV } from '../data/site';
import { scrollToHash } from '../lib/scroll';
import logoSrc from '../../public/brand/logo-completo.png';

// só carregado na versão sem 3D (inclui os dados do mapa)
const StaticIllustration = lazy(() => import('../components/StaticIllustration'));

function Hero() {
  const ref = useRef(null);

  // enquanto a Hero ocupa a tela, o header fica recolhido (o menu está na Hero)
  useLayoutEffect(() => {
    document.documentElement.classList.toggle('hero-active', window.scrollY < window.innerHeight * 0.45);
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => document.documentElement.classList.toggle('hero-active', entry.intersectionRatio > 0.55),
      { threshold: [0, 0.55, 1] },
    );
    io.observe(el);
    return () => { io.disconnect(); document.documentElement.classList.remove('hero-active'); };
  }, []);

  const go = (e, href) => { e.preventDefault(); scrollToHash(href); };

  return (
    <section id="inicio" ref={ref} className="chapter chapter--hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <h1 id="hero-title" className="hero__logo">
          <img src={logoSrc} alt={BRAND.name} width="1669" height="836" />
          {/* brilho que atravessa o logo na entrada (recortado no formato do logo) */}
          <span className="hero__shine" style={{ '--logo': `url(${logoSrc})` }} aria-hidden="true" />
          <span className="visually-hidden">, {BRAND.kind}</span>
        </h1>
        <p className="hero__tagline">{BRAND.tagline}</p>
        <nav className="hero__nav" aria-label="Navegação da página inicial">
          <ul>
            {HERO_NAV.map((n, i) => (
              <li key={n.href} style={{ '--i': i }}>
                <a href={n.href} onClick={(e) => go(e, n.href)}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="hero__cue" aria-hidden="true"><span className="hero__scroll"><span /></span></div>
    </section>
  );
}

function Chapter({ c, with3D }) {
  const titleId = `${c.id}-titulo`;
  return (
    <section id={c.id} className={`chapter chapter--${c.side}`} aria-labelledby={titleId}>
      <div className="chapter__inner">
        <p className="chapter__marker reveal">
          <span aria-hidden="true">{c.marker}</span> {c.kicker}
        </p>
        <h2 id={titleId} className="chapter__title reveal">{c.title}</h2>
        {c.body.map((p, i) => <p key={i} className="chapter__body reveal">{p}</p>)}
        {c.note && <p className="chapter__note reveal">{c.note}</p>}
      </div>
      {!with3D && <Suspense fallback={null}><StaticIllustration stage={c.stage} /></Suspense>}
    </section>
  );
}

export default function Story({ with3D }) {
  return (
    <div id="historia" className={`story ${with3D ? 'story--3d' : 'story--static'}`}>
      {CHAPTERS.map((c) => (c.side === 'hero'
        ? <Hero key={c.id} />
        : <Chapter key={c.id} c={c} with3D={with3D} />))}
    </div>
  );
}