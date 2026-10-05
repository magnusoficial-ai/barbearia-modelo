Crie o arquivo CLAUDE.md na raiz do repositório com exatamente este conteúdo:

# Padrão Magnus de Web Design

## Stack
- HTML + CSS + JS puro, sem build. Publicado no GitHub Pages.
- Animações: GSAP + ScrollTrigger via CDN (cdn.jsdelivr.net/npm/gsap). Rolagem suave opcional com Lenis.
- Ícones: Lucide (SVG). NUNCA usar emoji como ícone.
- Fontes: Google Fonts, no máximo 2 famílias.

## Processo obrigatório (nesta ordem)
1. Antes de codar, proponha 2 direções visuais diferentes (nome, adjetivos, paleta, par de fontes, 1 referência real de cada) e espere eu escolher.
2. Use as skills frontend-design e ui-ux-pro-max para fundamentar paleta, fontes e layout.
3. Defina os design tokens em :root (cores, escala tipográfica, espaçamentos múltiplos de 8, raios, sombras) e use SÓ esses tokens.
4. Construa mobile-first.
5. Autocrítica obrigatória: abra a página com Playwright (Chromium) em 390px e 1440px, tire screenshots da página inteira, olhe as imagens e liste o que parece genérico ou amador. Corrija e repita até não achar nada relevante. Só então me entregue, com os prints finais.

## Regras de qualidade
- Paleta 60-30-10; contraste mínimo 4,5:1 no texto (verifique os valores).
- Hierarquia clara: um único destaque por seção; evitar tudo centralizado e cards todos iguais.
- Fotos: placeholders de alta qualidade do Unsplash/Pexels marcados no código como "TROCAR POR FOTO DO CLIENTE", sempre com width/height e loading="lazy" (exceto a primeira).
- Animações: discretas (0,4–0,9s), só transform/opacity, e desligadas com prefers-reduced-motion.
- Botões e alvos de toque com 44px ou mais. WhatsApp sempre visível no celular.
- Proibido: gradiente roxo genérico, emoji como ícone, texto "Lorem ipsum", depoimentos ou números inventados.
- Textos em português do Brasil, curtos e concretos, falando do benefício para o cliente.
