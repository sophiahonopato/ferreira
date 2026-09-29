import { useEffect, useRef, useState } from 'react';
import { NAV } from '../data/site';
import { scrollToHash, setScrollLocked } from '../lib/scroll';
import Logo from './Logo';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    setScrollLocked(open);
    if (!open) return;
    // foco no primeiro link ao abrir (teclado e leitores de tela)
    requestAnimationFrame(() => document.querySelector('#menu-mobile a')?.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    if (!wasOpen) return scrollToHash(href);
    // espera destravar o scroll antes de navegar
    setScrollLocked(false);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(href)));
  };

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="site-header__bar">
        <a href="#inicio" className="site-header__brand" onClick={(e) => go(e, '#inicio')} aria-label="Paulo F. Ferreira Advogados, voltar ao início">
          <Logo />
        </a>
        <nav className="site-nav" aria-label="Principal">
          <ul>
            {NAV.map((n) => (
              <li key={n.href}><a className="link" href={n.href} onClick={(e) => go(e, n.href)}>{n.label}</a></li>
            ))}
          </ul>
        </nav>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{open ? 'Fechar menu' : 'Abrir menu'}</span>
          <span className="menu-toggle__line" aria-hidden="true" />
          <span className="menu-toggle__line" aria-hidden="true" />
        </button>
      </div>
      <nav id="menu-mobile" className="menu-mobile" aria-label="Principal (mobile)" hidden={!open}>
        <ol>
          {NAV.map((n) => (
            <li key={n.href}><a href={n.href} onClick={(e) => go(e, n.href)}>{n.label}</a></li>
          ))}
        </ol>
      </nav>
    </header>
  );
}
