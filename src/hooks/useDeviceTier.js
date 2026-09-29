/**
 * Decide o nível da experiência 3D:
 *  'high'   desktop: experiência completa
 *  'medium' tablet / notebooks modestos: menos partículas, sem parallax
 *  'low'    celular: versão simplificada
 *  'none'   sem WebGL: ilustrações estáticas (conteúdo 100% acessível)
 */
const ATTRS = { alpha: true, antialias: false, stencil: false, powerPreference: 'high-performance' };

/** O Three.js atual exige WebGL 2: testar WebGL 1 dava falso positivo. */
function probe(type = 'webgl2', extra = {}) {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext(type, { ...ATTRS, ...extra });
    if (!gl) return null;
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    gl.getExtension('WEBGL_lose_context')?.loseContext(); // libera o contexto de teste
    return { renderer: String(renderer) };
  } catch {
    return null;
  }
}

/** Informações para o painel de diagnóstico (?diagnostico). */
export const gpuInfo = { webgl2: null, webgl1: null, software: false };

export function detectTier() {
  gpuInfo.webgl2 = window.WebGL2RenderingContext ? probe('webgl2') : null;
  if (!gpuInfo.webgl2) {
    gpuInfo.webgl1 = probe('webgl');
    return 'none';
  }
  // WebGL só por software (sem GPU real): versão leve
  const software = !probe('webgl2', { failIfMajorPerformanceCaveat: true });
  gpuInfo.software = software;
  const w = window.innerWidth;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const mem = navigator.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  if (w < 768 || mem <= 2 || software) return 'low';
  if (w < 1200 || coarse || mem <= 4 || cores <= 4) return 'medium';
  return 'high';
}
