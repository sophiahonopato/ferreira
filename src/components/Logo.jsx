import { BRAND } from '../data/site';

/**
 * Logo da marca. Usa o arquivo oficial se BRAND.logoSrc estiver definido;
 * caso contrário, o monograma tipográfico provisório.
 */
export default function Logo({ variant = 'full', className = '' }) {
  if (BRAND.logoSrc) {
    return <img className={`logo logo--img ${className}`} src={BRAND.logoSrc} alt={BRAND.name} />;
  }
  return (
    <span className={`logo logo--${variant} ${className}`}>
      <svg className="logo__mark" viewBox="0 0 64 40" aria-hidden="true" focusable="false">
        <text x="32" y="30" textAnchor="middle">PF</text>
        <line x1="20" y1="36.5" x2="44" y2="36.5" />
      </svg>
      {variant === 'full' && (
        <span className="logo__type">
          <span className="logo__name">Paulo F. Ferreira</span>
          <span className="logo__sub">Advogados</span>
        </span>
      )}
      <span className="visually-hidden">{variant !== 'full' ? BRAND.name : ''}</span>
    </span>
  );
}
