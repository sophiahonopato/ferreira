/**
 * Hero + capítulos narrativos. Cada capítulo ocupa uma "tela" de scroll;
 * o texto é sempre HTML real (acessível e indexável), o 3D apenas o acompanha.
 */
import { BRAND, CHAPTERS, CONTACT } from '../data/site';
import { scrollToHash } from '../lib/scroll';
import { lazy, Suspense } from 'react';

// só carregado na versão sem 3D (inclui os dados do mapa)
const StaticIllustration = lazy(() => import('../components/StaticIllustration'));
import Logo from '../components/Logo';

function Hero({ with3D }) {
  return (
    <section id="inicio" className="chapter chapter--hero" aria-labelledby="hero-title">
      <div className="hero">
        {!with3D && <Logo variant="mark" className="hero__static-logo" />}
        <div className="hero__copy">
          <h1 id="hero-title" className="hero__name hero__reveal">
            {BRAND.name}
            <span className="hero__kind">{BRAND.kind}</span>
          </h1>
          <p className="hero__tagline hero__reveal">{BRAND.tagline}</p>
          <div className="hero__actions hero__reveal">
            <a className="button" href={CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer">
              Fale conosco
            </a>
            <a className="link link--quiet" href="#escritorio" onClick={(e) => { e.preventDefault(); scrollToHash('#escritorio'); }}>
              Conheça o escritório
            </a>
          </div>
        </div>
        {with3D && <span className="hero__scroll" aria-hidden="true"><span /></span>}
      </div>
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
        ? <Hero key={c.id} with3D={with3D} />
        : <Chapter key={c.id} c={c} with3D={with3D} />))}
    </div>
  );
}
