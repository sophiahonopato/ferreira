import { CONTACT } from '../data/site';

export default function Contact() {
  return (
    <section id="contato" className="section contact" aria-labelledby="contact-title">
      <h2 id="contact-title" className="contact__title">Precisamos conversar sobre o seu caso?</h2>
      <p className="contact__lead">
        Estamos prontos para ouvir e analisar a sua situação com atenção e sigilo.
      </p>
      <div className="contact__actions">
        <a className="button button--large" href={CONTACT.whatsapp.href} target="_blank" rel="noopener noreferrer">
          Fale conosco
        </a>
        <p className="contact__alt">
          ou ligue <a className="link" href={CONTACT.phone.href}>{CONTACT.phone.label}</a>
          , ou escreva para <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
      </div>
    </section>
  );
}
