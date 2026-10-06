# MAGNUS · vídeo publicitário (Remotion)

Comercial de 40s da MAGNUS em React + TypeScript com [Remotion](https://www.remotion.dev), em três versões:

| Composição | Formato | Duração | Uso |
|---|---|---|---|
| `MagnusAd-Vertical` | 1080x1920 | 40s | Reels, TikTok, Status |
| `MagnusAd-Horizontal` | 1920x1080 | 40s | YouTube, site |
| `MagnusAd-15s` | 1080x1920 | 15s | corte curto: cenas 1, 2, Atende, Pulse e 6 |

As três usam os mesmos componentes de cena. Cada cena lê o tamanho do quadro e escolhe o layout (texto em cima no vertical, lado a lado no horizontal).

## Rodar

```bash
npm install
npm run dev          # Remotion Studio no navegador, para ver e ajustar
npm run stills       # um frame de cada cena em out/stills (para revisão)
npm run render       # os três MP4 em out/
```

Se o download automático do Chrome do Remotion estiver bloqueado na sua rede, aponte para um Chrome/Chromium instalado:
`REMOTION_BROWSER_EXECUTABLE=/caminho/do/chrome npm run render`.

## Onde mexer

- **Textos e produtos:** `src/content.ts`. Toda a copy está ali (frases, nomes, mensagens do WhatsApp, horários da agenda, números do painel, nichos, slogan, @).
- **Cores, fontes, tamanhos:** `src/theme.ts`. Preto `#0D0D0D`, off-white `#F5F5F5`, cinzas e o verde `#3DDC84` (só em número positivo). Fontes via `@remotion/google-fonts`: Space Grotesk e IBM Plex Sans.
- **Tempos dos cortes:** `src/MagnusAd.tsx` (`fullPlan` e `shortPlan`). Os tempos internos de cada cena ficam no topo do arquivo da cena.
- **Ícones:** `src/components/icons.ts` (Lucide).
- **Trilha:** coloque o arquivo em `public/audio/trilha.mp3` e descomente as duas linhas marcadas com `TRILHA` em `src/MagnusAd.tsx`. Veja `public/audio/LEIA-ME.txt`.

## Ritmo

O vídeo foi montado numa grade de 120 BPM, em que 1 tempo = 0,5s = 15 frames. Todos os cortes caem em segundo inteiro, que são os tempos 1 e 3 do compasso. Cada transição dura 0,4s e termina exatamente no corte.

| Tempo | Cena |
|---|---|
| 0–4s | 1 · Problema: notificações às 23:47, "Seu cliente não espera." |
| 4–7s | 2 · Virada: a linha apaga tudo e desenha o M; corte seco para o logo aos 6s |
| 7–11s | 3 · Cubo: um quarto de volta por tempo, um produto por face |
| 11–28s | 4 · Produtos: Sites, Atende, Agenda (3s cada), Flow (2s), Pulse e Voz (3s cada) |
| 28–34s | 5 · Nichos: um ícone acende por tempo; fecha com máscara circular |
| 34–40s | 6 · Fechamento: logo, slogan palavra por palavra, botão e @magnus.ia |

## Logo

Os arquivos enviados pela marca estão em `public/brand/originais/`. Eles foram vetorizados, sem redesenho, pelo script `scripts/vetorizar-logo.py`, que gera:

- `public/brand/magnus-logotipo.svg`, `magnus-icone.svg` e `magnus-m.svg`;
- `src/brand/logo-paths.ts`, com os mesmos desenhos para o código e a linha central do M usada na animação de traço.

Se o logo mudar, troque os JPG/PNG em `originais/` e rode `python3 scripts/vetorizar-logo.py` (precisa de `pip install potracer scikit-image pillow numpy`).

## Estrutura

```
src/
  content.ts          copy editável
  theme.ts            design tokens
  MagnusAd.tsx        sequência das cenas e transições
  Root.tsx            as três composições
  scenes/             Opening (cenas 1 e 2), CubeScene, products/*, Niches, Closing
  components/         Cube (CSS 3D), Devices (celular/notebook), Circuit (trilhas), RevealText, Badge…
  transitions/        wipe de linha e "portal" (mergulho na face do cubo)
public/brand/         logos (originais e SVG)
public/audio/         trilha (vazia)
out/                  MP4 finais e frames de revisão
```

Os números do painel (1.248 leads, +142%, 4,7x) são ilustrativos e aparecem com a legenda "Simulação. Valores ilustrativos."
