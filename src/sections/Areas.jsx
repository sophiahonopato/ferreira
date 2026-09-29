import { useState } from 'react';
import { AREAS, QUOTE } from '../data/site';

export default function Areas() {
  const [open, setOpen] = useState(null);

  return (
    <section id="areas-de-atuacao" className="section areas" aria-labelledby="areas-title">
      <div className="areas__intro">
        <h2 id="areas-title" className="section__title">Áreas de atuação</h2>
        <p className="section__lead">
          Uma abordagem integrada, com equipes adaptadas a cada cliente e a cada projeto.
        </p>
        <blockquote className="areas__quote">
          <p>“{QUOTE.text}”</p>
          <cite>{QUOTE.author}</cite>
        </blockquote>
      </div>

      <ul className="areas__list">
        {AREAS.map((a) => {
          const isOpen = open === a.id;
          const panelId = `${a.id}-detalhes`;
          return (
            <li key={a.id} id={a.id} className={`area ${isOpen ? 'is-open' : ''}`}>
              <h3 className="area__heading">
                <button
                  type="button"
                  className="area__toggle"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : a.id)}
                >
                  <span className="area__name">{a.name}</span>
                  <span className="area__summary">{a.summary}</span>
                  <span className="area__icon" aria-hidden="true" />
                </button>
              </h3>
              <div id={panelId} className="area__panel" role="region" aria-label={a.name}>
                <div className="area__panel-inner">
                  <ul className="area__items">
                    {a.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
