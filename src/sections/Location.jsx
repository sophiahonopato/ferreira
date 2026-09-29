import { CONTACT } from '../data/site';

const key = import.meta.env.VITE_GOOGLE_MAPS_EMBED_KEY;
const q = encodeURIComponent(CONTACT.mapsQuery);
// Com chave: Maps Embed API. Sem chave: embed público (não exige API).
const embedSrc = key
  ? `https://www.google.com/maps/embed/v1/place?key=${key}&q=${q}&language=pt-BR`
  : `https://maps.google.com/maps?q=${q}&hl=pt-BR&z=16&output=embed`;
const openHref = `https://www.google.com/maps/search/?api=1&query=${q}`;

export default function Location() {
  const a = CONTACT.address;
  return (
    <section id="localizacao" className="section location" aria-labelledby="location-title">
      <div className="location__info">
        <h2 id="location-title" className="section__title">Onde estamos</h2>
        <address className="location__address">
          <span>{a.street}</span>
          <span>{a.district}</span>
          <span>{a.city}</span>
          <span>{a.zip}</span>
        </address>
        <dl className="location__contacts">
          <div><dt>Telefone</dt><dd><a className="link" href={CONTACT.phone.href}>{CONTACT.phone.label}</a></dd></div>
          <div><dt>WhatsApp</dt><dd><a className="link" href={CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer">{CONTACT.whatsapp.label}</a></dd></div>
          <div><dt>E-mail</dt><dd><a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></dd></div>
        </dl>
        <a className="link" href={openHref} target="_blank" rel="noopener noreferrer">Abrir rota no Google Maps</a>
      </div>
      <div className="location__map">
        <iframe
          title={`Mapa: ${CONTACT.mapsQuery}`}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
