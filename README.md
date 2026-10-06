# barbearia-modelo

Landing page de demonstração de uma barbearia fictícia em Teresina-PI. Um arquivo HTML estático, sem build, publicado no GitHub Pages.

Direção visual "Navalha Noturna": carvão, osso e vermelho-tijolo, com títulos em Barlow Condensed e texto em Barlow.

## Arquivos

- `index.html`: a página inteira (HTML, CSS e JavaScript).
- `fotos/`: lugar das fotos do cliente. Veja `fotos/LEIA-ME.txt`.

Bibliotecas carregadas por CDN: GSAP + ScrollTrigger + DrawSVG (animações) e Google Fonts. Ícones Lucide embutidos no HTML.

## Como adaptar para um cliente

Abra `index.html` e procure:

- `TROCAR POR FOTO DO CLIENTE`: as 6 fotos (hoje são placeholders do Unsplash).
- `TROCAR:`: número do WhatsApp, preços, horários, endereço, mapa e Instagram.

O número do WhatsApp (`5586999999999`) aparece em vários links. Use Localizar e substituir para trocar todos de uma vez.

Os horários ficam em um lugar só: a lista da seção "Onde fica". O aviso "Aberto agora" / "Fechado agora" no topo é calculado a partir dela, no fuso de Teresina.

## Animações

- Topo: a foto assenta e o texto sobe em sequência.
- Assinatura: na seção "Marcou, sentou, cortou." a tesoura se desenha (DrawSVG) e corta a linha tracejada.
- Galeria: mosaico entra em cascata, com leve profundidade nas fotos ao rolar.

Todas usam só transform e opacity, duram de 0,4s a 0,9s e ficam desligadas para quem ativou "reduzir movimento". Sem JavaScript ou sem o GSAP, a página aparece completa, só sem movimento.

## Ver no computador

Abra `index.html` no navegador. Para publicar, envie `index.html` e a pasta `fotos/`.

## Outros projetos neste repositório

- `magnus-ad/`: comercial da MAGNUS em Remotion (vídeos vertical, horizontal e de 15s). Veja `magnus-ad/README.md`.
