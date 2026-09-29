import { BRAND, CONTACT } from '../data/site';
import Logo from '../components/Logo';

export default function Footer() {
  const a = CONTACT.address;
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <Logo />
          <p className="site-footer__legal">{BRAND.legalName}</p>
        </div>
        <p className="site-footer__address">
          {a.street}<br />{a.district}, {a.city}<br />{a.zip}
        </p>
        <ul className="site-footer__social" aria-label="Redes sociais">
          {CONTACT.social.map((s) => (
            <li key={s.href}><a className="link" href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>
          ))}
        </ul>
      </div>
      <p className="site-footer__copy">© {new Date().getFullYear()} {BRAND.name}. Todos os direitos reservados.</p>
    </footer>
  );
}
