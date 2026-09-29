# Paulo F. Ferreira Advogados — site institucional

Experiência narrativa em 3D controlada pelo scroll:
**logo → envelope → documento → mapa → globo → arquitetura → conteúdo → logo**.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # produção (pasta dist/)
npm run preview    # testar o build
```

## Antes de publicar (checklist)

| Item | Onde |
|---|---|
| Logo oficial (SVG ou PNG transparente) | salvar em `public/brand/` e definir `BRAND.logoSrc` em `src/data/site.js` |
| Foto do Paulo Cesar | copiar `paulo-cesar.jpg` do site atual para `public/images/equipe/` |
| OAB do Paulo Cesar | `TEAM[0].oab` em `src/data/site.js` |
| Confirmar endereço | o site antigo ainda mostra Alameda dos Maracatins |
| Confirmar Direito Imigratório como área própria | no site antigo está dentro de Direito Internacional |
| Imagem de compartilhamento 1200×630 | `public/brand/og-image.jpg` |
| (Opcional) chave do Google Maps | copiar `.env.example` para `.env` |

Todo o conteúdo fica em **um só arquivo**: `src/data/site.js`.
Itens pendentes estão marcados com `[PREENCHER]` ou `[CONFIRMAR]`.

### Adicionar um advogado
Em `TEAM`, substitua um objeto com `placeholder: true` pelos dados reais
(`name`, `role`, `oab`, `photo`, `bio`, `languages`, `areas`, `linkedin`) e remova `placeholder`.

## Arquitetura

```
src/
  data/        conteúdo (site.js) e pontos dos continentes (landPoints.json)
  sections/    seções da página (HTML semântico)
  components/  header, logo, ilustrações estáticas
  three/       experiência WebGL (carregada sob demanda)
    lib/shapes.js      formas que as partículas assumem
    lib/stages.js      linha do tempo: câmera, rotações, rotas
    lib/particleShader.js
    scenes/            partículas, globo, rotas, câmera
  animations/  Lenis + GSAP ScrollTrigger (scroll → narrativa)
  hooks/       detecção de dispositivo e movimento reduzido
  lib/         estado compartilhado DOM ↔ WebGL, navegação por âncora
  styles/      tokens, base, seções
scripts/generate-land-points.mjs   gera landPoints.json (Natural Earth)
```

### Como a metamorfose funciona
Um único sistema de ~5.800 partículas. A partícula *i* é sempre a mesma e está
ligada a um ponto real de terra (lon/lat). Cada cena é só um novo destino para
as mesmas partículas, então o documento literalmente se transforma no mapa,
o mapa se curva em globo e o globo se reorganiza em arquitetura.
O scroll produz um número contínuo (0 a 10) que o shader interpola.

## Performance e acessibilidade
- Three.js fica fora do bundle inicial (import dinâmico).
- Três níveis: desktop (5.800 partículas), tablet (3.600), celular (2.200, sem halo nem parallax).
- DPR limitado e reduzido automaticamente se o FPS cair.
- Render pausado quando o canvas está oculto (seções de conteúdo).
- Sem WebGL ou com `prefers-reduced-motion`: versão estática com ilustrações SVG,
  sem scroll suave nem animações. Todo o conteúdo é HTML real em qualquer modo.
- Skip link, foco visível, menu mobile fecha com Esc, acordeões com `aria-expanded`.

## SEO
Title, description, Open Graph, `LegalService` (JSON-LD), headings hierárquicos,
âncoras amigáveis, `robots.txt` e `sitemap.xml`.
Próximo passo recomendado: uma página própria por área de atuação
(ex.: `/direito-tributario`) para ranquear buscas específicas.
# ferreira
