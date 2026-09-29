/**
 * Painel de diagnóstico: abra o site com ?diagnostico no final da URL.
 * Mostra por que a experiência 3D está (ou não) ativa neste computador.
 * Invisível para visitantes comuns.
 */
import { gpuInfo } from '../hooks/useDeviceTier';

export function reasonFor({ tier, reduced, calm, failed3D }) {
  if (reduced && !calm) return 'O sistema pede movimento reduzido. No Windows: Configurações > Acessibilidade > Efeitos visuais > "Efeitos de animação" desligado.';
  if (tier === 'none' && gpuInfo.webgl1) return 'Este navegador só oferece WebGL 1. O 3D exige WebGL 2 (atualize o driver de vídeo ou o navegador).';
  if (tier === 'none') return 'WebGL indisponível. Verifique se a "aceleração de hardware" está ativada no navegador.';
  if (failed3D) return `O 3D falhou ao iniciar: ${failed3D === true ? 'erro desconhecido' : failed3D}`;
  if (calm) return 'Modo calmo: o aparelho pede menos movimento (Windows "Efeitos de animação" / Android "Remover animações"). 3D ativo, sem movimentos automáticos.';
  return null;
}

export default function Diagnostics(props) {
  const reason = reasonFor(props);
  if (reason) console.info('[3D]', reason);
  if (!new URLSearchParams(window.location.search).has('diagnostico')) return null;

  const rows = [
    ['Modo', props.with3D ? `3D (nível ${props.tier})${props.calm ? ', calmo' : ''}` : 'versão estática'],
    ['Motivo', reason ?? '—'],
    ['Movimento reduzido', props.reduced ? 'sim' : 'não'],
    ['WebGL 2', gpuInfo.webgl2 ? 'sim' : 'não'],
    ['WebGL 1', gpuInfo.webgl2 ? '—' : gpuInfo.webgl1 ? 'sim' : 'não'],
    ['GPU', (gpuInfo.webgl2 || gpuInfo.webgl1)?.renderer ?? 'desconhecida'],
    ['Só por software', gpuInfo.software ? 'sim' : 'não'],
    ['Navegador', navigator.userAgent],
  ];
  return (
    <aside className="diagnostics" aria-label="Diagnóstico da experiência 3D">
      <strong>Diagnóstico 3D</strong>
      <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
    </aside>
  );
}
