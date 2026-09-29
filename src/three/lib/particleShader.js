export const particleVertex = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aRand;
  attribute float aAccent;
  uniform float uT;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uScatter;
  uniform float uAccent;
  uniform float uIntro;
  uniform float uMotion;
  uniform vec3 uPaper;
  uniform vec3 uBrass;
  uniform vec3 uSteel;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    // atraso individual: a forma se reorganiza em onda, não de uma vez
    float d = aRand * 0.35;
    float t = smoothstep(d, d + 0.65, uT);
    vec3 p = mix(aFrom, aTo, t);

    // no meio da transição, leve dispersão: a matéria "respira" entre as formas
    vec3 dir = vec3(aRand - 0.5, fract(aRand * 7.31) - 0.5, fract(aRand * 13.7) - 0.5);
    p += dir * sin(t * 3.14159) * uScatter;

    // abertura: a identidade se constrói a partir de matéria dispersa
    float ii = smoothstep(aRand * 0.45, aRand * 0.45 + 0.55, uIntro);
    p = mix(p + normalize(dir + 1e-4) * (3.0 + aRand * 5.0), p, ii);

    // micro-movimento contínuo, quase imperceptível
    p += uMotion * 0.004 * vec3(sin(uTime * 0.7 + aRand * 60.0), cos(uTime * 0.55 + aRand * 40.0), 0.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float accent = aAccent * uAccent;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRand * 0.9) * (1.0 + accent * 0.35) / -mv.z;

    vec3 base = mix(uPaper, uSteel, step(0.93, fract(aRand * 91.7)));
    vColor = mix(base, uBrass, accent);
    vFade = smoothstep(40.0, 20.0, -mv.z); // só some bem ao fundo
  }
`;

export const particleFragment = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vColor, a * uOpacity * vFade);
  }
`;
