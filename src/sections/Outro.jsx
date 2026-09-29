import { BRAND, CONTACT } from '../data/site';
import Logo from '../components/Logo';

/** Encerramento: os objetos se recolhem e resta a marca (ciclo). */
export default function Outro({ with3D }) {
  return (
    <section id="encerramento" className={`outro ${with3D ? 'outro--3d' : ''}`} aria-label="Encerramento">
      <div className="outro__stage">
        <div className="outro__sign">
          {!with3D && <Logo variant="mark" className="outro__logo" />}
          <p className="outro__name">{BRAND.name}</p>
          <p className="outro__tagline">{BRAND.tagline}</p>
          <a className="button" href={CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer">Fale conosco</a>
        </div>
      </div>
    </section>
  );
}
