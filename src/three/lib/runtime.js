import { experience } from '../../lib/experienceStore';

/** Estágio suavizado, lido por todos os componentes 3D no mesmo frame. */
export const runtime = { s: 0, time: 0, px: 0, py: 0 };

export function tickRuntime(dt, elapsed) {
  const k = 1 - Math.exp(-dt * 5.5);
  runtime.s += (experience.stage - runtime.s) * k;
  runtime.px += (experience.pointer.x - runtime.px) * k * 0.5;
  runtime.py += (experience.pointer.y - runtime.py) * k * 0.5;
  runtime.time = elapsed;
}
