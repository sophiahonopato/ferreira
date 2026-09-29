/**
 * Versões estáticas (SVG) dos objetos da narrativa.
 * Usadas quando não há WebGL ou quando o usuário prefere movimento reduzido.
 */
import { useMemo } from 'react';
import landRaw from '../data/landPoints.json';

const LON0 = -50;
const wrap = (lon) => ((lon - LON0 + 540) % 360) - 180;

function DotMap({ width = 360, height = 180, every = 4, className = "dots" }) {
  const dots = useMemo(() => {
    const out = [];
    for (let i = 0; i < landRaw.length; i += 2 * every) {
      const x = ((wrap(landRaw[i]) + 180) / 360) * width;
      const y = ((90 - landRaw[i + 1]) / 180) * height;
      out.push([x.toFixed(1), y.toFixed(1)]);
    }
    return out;
  }, [width, height, every]);
  return (
    <g className={className}>
      {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="0.9" />)}
    </g>
  );
}

const Envelope = ({ open }) => (
  <g>
    {open && <path d="M70 70 V20 H250 V70" className="thin" />}
    <rect x="40" y="70" width="240" height="160" />
    {open ? <path d="M40 70 L160 -10 L280 70" className="thin" /> : <path d="M40 70 L160 150 L280 70" />}
    <path d="M40 230 L160 145 L280 230" className="thin" />
  </g>
);

const Document = ({ map }) => (
  <g>
    <rect x="80" y="10" width="160" height="220" />
    <line x1="98" y1="36" x2="190" y2="36" />
    {Array.from({ length: map ? 4 : 11 }, (_, i) => (
      <line key={i} className="thin" x1="98" y1={58 + i * 14} x2={98 + (i % 4 === 3 ? 70 : 124)} y2={58 + i * 14} />
    ))}
    {map && <g transform="translate(96 118) scale(0.355)"><DotMap every={6} /></g>}
    <circle cx="210" cy="206" r="10" className="thin" />
  </g>
);

const Globe = () => (
  <g>
    <circle cx="160" cy="120" r="100" />
    <ellipse cx="160" cy="120" rx="45" ry="100" className="thin" />
    <ellipse cx="160" cy="120" rx="80" ry="100" className="thin" />
    <line x1="60" y1="120" x2="260" y2="120" className="thin" />
    <ellipse cx="160" cy="120" rx="100" ry="30" className="thin" />
    <path d="M150 170 Q180 60 215 70" className="accent" />
    <path d="M150 170 Q120 90 110 80" className="accent" />
    <circle cx="150" cy="170" r="4" className="accent-fill" />
  </g>
);

const Architecture = () => (
  <g>
    <line x1="10" y1="200" x2="310" y2="200" />
    <rect x="140" y="40" width="16" height="160" />
    <rect x="164" y="40" width="16" height="160" />
    <line x1="156" y1="80" x2="164" y2="80" className="thin" />
    <path d="M60 200 A36 30 0 0 1 132 200" />
    <path d="M190 172 Q235 215 280 172" />
    {Array.from({ length: 7 }, (_, i) => (
      <path key={i} className="thin" d={`M${40 + i * 36} 232 Q${58 + i * 36} 206 ${76 + i * 36} 232`} />
    ))}
  </g>
);

export default function StaticIllustration({ stage }) {
  let content;
  switch (stage) {
    case 1: content = <Envelope />; break;
    case 2: content = <Envelope open />; break;
    case 3: content = <Document />; break;
    case 4: content = <Document map />; break;
    case 5: content = <g transform="translate(-20 30)"><DotMap /></g>; break;
    case 6: content = <Globe />; break;
    case 7: content = <Architecture />; break;
    default: return null;
  }
  return (
    <svg className="illustration" viewBox="0 -20 320 260" aria-hidden="true" focusable="false">
      {content}
    </svg>
  );
}
