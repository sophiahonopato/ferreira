import { useState } from 'react';
import { TEAM } from '../data/site';

const initials = (name) => name.split(' ').filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join('');

function Portrait({ person }) {
  const [failed, setFailed] = useState(false);
  if (person.photo && !failed) {
    return (
      <img
        className="member__photo"
        src={person.photo}
        alt={`Retrato de ${person.name}`}
        loading="lazy"
        decoding="async"
        width="800"
        height="1000"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="member__photo member__photo--empty" aria-hidden="true">
      <span>{person.placeholder ? '' : initials(person.name)}</span>
    </div>
  );
}

function Member({ person, featured }) {
  return (
    <article className={`member ${featured ? 'member--featured' : ''} ${person.placeholder ? 'member--placeholder' : ''}`}
      aria-label={person.placeholder ? 'Card modelo para futuro integrante' : undefined}>
      <Portrait person={person} />
      <div className="member__body">
        <h3 className="member__name">{person.name}</h3>
        <p className="member__role">
          {person.role}
          {person.oab ? <span className="member__oab">{person.oab}</span> : null}
        </p>
        <ul className="member__bio">
          {person.bio.map((b) => <li key={b}>{b}</li>)}
        </ul>
        {person.languages && <p className="member__meta"><strong>Idiomas</strong> {person.languages}</p>}
        {person.areas?.length > 0 && <p className="member__meta"><strong>Atuação</strong> {person.areas.join(', ')}</p>}
        {person.linkedin && (
          <a className="link" href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        )}
      </div>
    </article>
  );
}

export default function Team() {
  const [lead, ...others] = TEAM;
  return (
    <section id="corpo-juridico" className="section team" aria-labelledby="team-title">
      <h2 id="team-title" className="section__title">Corpo jurídico</h2>
      <Member person={lead} featured />
      <div className="team__grid">
        {others.map((p, i) => <Member key={i} person={p} />)}
      </div>
    </section>
  );
}
