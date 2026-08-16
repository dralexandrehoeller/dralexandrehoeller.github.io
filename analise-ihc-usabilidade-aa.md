# Análise de IHC e Acessibilidade (nível AA) — dralexandrehoeller.github.io

**Data da análise original:** 15/08/2026
**Última atualização:** 15/08/2026 — todos os 12 achados foram corrigidos e revalidados em navegador.
**Escopo:** `index.html`, `style.css`, `script.js` (site estático, sem back-end/formulários)
**Metodologia:** Avaliação heurística (Nielsen) + verificação de conformidade com as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1/2.2, nível **AA** (que exige o cumprimento cumulativo de todos os critérios de Nível A + Nível AA). A revisão inicial foi feita por leitura de código; as correções foram testadas em navegador real (Chromium), incluindo navegação só por teclado, leitura do CSSOM computado e simulação de tempo de autoplay.

---

## Resumo executivo

O site já partia de uma base sólida de acessibilidade (skip link, landmarks semânticos, hierarquia de headings consistente, `lang="pt-BR"`, ícones decorativos ocultados corretamente, menu mobile com `aria-expanded`/`aria-label` dinâmicos). Os 12 achados desta análise — 2 de alta prioridade, 4 de média e 6 de baixa (a numeração original tinha 5 itens de baixa; o item 9, resolvido manualmente pelo Arliones, foi incorporado à contagem) — **foram todos corrigidos**.

| Prioridade | Nº de achados | Status |
|---|---|---|
| 🔴 Alta (bloqueava conformidade AA) | 2 | ✅ Resolvidos |
| 🟡 Média | 4 | ✅ Resolvidos |
| 🟢 Baixa (refinamento) | 6 | ✅ Resolvidos |

---

## Pontos fortes já implementados (linha de base, antes das correções)

- **Skip link funcional** — `<a href="#inicio" class="skip-link">Pular para o conteúdo</a>`, visível ao receber foco.
- **Landmarks semânticos completos** — `<header>`, `<nav>`, `<main>`, `<footer>` (não `<div>`s genéricas).
- **Um único `<h1>`** na página, com hierarquia `h2 > h3` consistente em todas as seções.
- **`lang="pt-BR"`** declarado no `<html>` — critério 3.1.1 (Nível A).
- **Ícones decorativos corretamente ocultados** (`aria-hidden="true"`) sempre acompanhados de texto visível equivalente.
- **Estrelas de avaliação com semântica correta** — `role="img" aria-label="Nota 5,0 de 5 estrelas"`.
- **Menu hamburguer acessível** — alterna `aria-expanded`/`aria-label` conforme o estado.
- **Viewport sem bloqueio de zoom** — preserva o zoom do usuário (1.4.4 e 1.4.10).
- **Contraste de texto muito bom** na maior parte do conteúdo (≈5,5 a 12,6:1, folgado acima do mínimo de 4,5:1).
- **Links externos com `rel="noopener noreferrer"`** em todas as ocorrências.

---

## Achados e correções aplicadas

### 🔴 1. Carrossel sem controle de pausa acessível a todos os usuários — ✅ Resolvido

- **Critério WCAG:** 2.2.2 *Pause, Stop, Hide* (Nível A)
- **Problema original:** o autoplay (6s) só pausava com mouse ou foco; no toque (mobile), o `touchend` sempre religava o autoplay, então nunca ficava pausado de forma confiável.
- **Correção:** adicionado um botão de pausa/retomar persistente (`#carouselPausa`, ícone ⏸/▶, `aria-pressed`) ao lado dos indicadores. Uma vez pausado pelo usuário, o autoplay não é retomado automaticamente por hover, foco ou toque — só quando o próprio usuário clica em "retomar". Testado: com o carrossel pausado, a posição não mudou mesmo esperando mais que o intervalo de autoplay (6,5s).

### 🔴 2. Indicadores (dots) abaixo do tamanho mínimo de toque — ✅ Resolvido

- **Critério WCAG:** 2.5.8 *Target Size (Minimum)* (Nível AA, WCAG 2.2)
- **Problema original:** dots de 9×9px com 8px de espaçamento — distância entre centros de ~17px, abaixo dos 24px exigidos.
- **Correção:** o círculo visual continua pequeno (9px), mas a área clicável de cada botão foi ampliada para 24×24px via `::before`. Testado: `getBoundingClientRect()` confirma 24×24px com 28px de distância entre centros.

### 🟡 3. Depoimentos longos cortados sem forma de ler o restante — ✅ Resolvido

- **Problema original:** avaliações longas eram cortadas em 4 linhas sem link "ler mais"; o texto completo só chegava a quem usava leitor de tela.
- **Correção:** botão "Ler mais" adicionado automaticamente (via `script.js`, medindo `scrollHeight` vs `clientHeight`) a cada depoimento que é visualmente cortado. Abre um modal acessível com o texto completo — foco preso no botão de fechar, `Esc` fecha, foco retorna ao botão que abriu — e **pausa o carrossel enquanto o modal estiver aberto**, retomando (se aplicável) só ao fechar. Testado: 4 dos 15 depoimentos precisam do botão; nenhum card estourou a altura fixa.

### 🟡 4. Nenhum aviso de status ao trocar de depoimento — ✅ Resolvido

- **Critério WCAG:** 4.1.3 *Status Messages* (Nível AA)
- **Correção:** região `role="status" aria-live="polite"` (`#carouselStatus`) que anuncia "Avaliação X de 15, de [autor]" a cada troca de slide, por autoplay, setas ou dots.

### 🟡 5. Contraste no limite mínimo em dois elementos — ✅ Resolvido

- **Critério WCAG:** 1.4.3 *Contrast (Minimum)* (Nível AA)
- **Problema original:** o badge "CRM/SC 34061" (`~4,77:1`) e o texto do card de CTA científico sobre gradiente (`~4,53:1`) ficavam perto demais do mínimo de 4,5:1.
- **Correção:** novo token `--a11y-accent: #326557` (variante mais escura de `--primary-light`), usado no badge do hero. Contraste recalculado: **6,41:1** contra o fundo do hero e **6,70:1** contra branco — folga confortável acima do mínimo.
- **Nota:** o card de CTA científico foi posteriormente redesenhado (ver achado adicional abaixo) para fundo claro com texto `--primary`, o que elevou o contraste ali para **7,98:1**.

### 🟡 6. Links repetidos "Ver artigo →" sem nome acessível distinto — ✅ Resolvido

- **Critério WCAG:** 2.4.4 *Link Purpose (In Context)* (Nível A)
- **Correção:** `aria-label="Ver artigo: [título completo da publicação]"` adicionado individualmente às 8 ocorrências, mantendo o texto visível "Ver artigo →" inalterado.

### 🟢 7. Estilo de foco de teclado não customizado — ✅ Resolvido

- **Critério WCAG:** 2.4.7 *Focus Visible* (Nível AA)
- **Correção:** regra global `:focus-visible { outline: 3px solid var(--a11y-accent); outline-offset: 3px; }`, com uma sobreposição (`.topbar :focus-visible, footer :focus-visible`) trocando para branco nos dois trechos de fundo verde escuro (cabeçalho e rodapé), onde o verde do anel perderia contraste.
- **Testado com Tab real** (não só `.focus()` via script, que tem heurística própria e menos confiável): no link "Início" do menu, o anel aparece branco, sólido, 3px, com 3px de distância — bem visível sobre o verde. No link "Ver artigo" (fundo branco), o anel aparece na cor `--a11y-accent` (`rgb(50,101,87)`) — também bem visível.

### 🟢 8. Textos muito pequenos nos cards de publicação — ✅ Resolvido

- **Correção:** `.publicacao-tag` de 0,58rem (~9,3px) para 0,72rem (~11,5px); `.publicacao-revista-meta` de 0,66rem (~10,6px) para 0,75rem (~12px). Testado: nenhum dos 8 cards de publicação estourou a largura do cabeçalho do card.

### 🟢 9. Depoimento duplicado — ✅ Resolvido (correção manual do Arliones)

- **Problema original:** o depoimento de "C.M." aparecia duas vezes.
- **Correção:** uma das duas ocorrências foi removida diretamente pelo Arliones — confirmado que só resta uma no HTML atual.

### 🟢 10. `alt` da foto do herói minimalista — ✅ Resolvido

- **Correção:** `alt` alterado de `"Dr. Alexandre A. Hoeller"` para `"Dr. Alexandre A. Hoeller sorrindo, vestindo jaleco branco e estetoscópio no pescoço"`, descrevendo o que a foto de fato comunica.

### 🟢 11. Sem indicação da seção ativa durante a rolagem — ✅ Resolvido

- **Correção:** `IntersectionObserver` (`script.js`) observa cada seção correspondente a um item do menu e aplica `aria-current="true"` à seção cuja faixa central da viewport está ocupando no momento; `.nav-link[aria-current="true"]` recebe um destaque visual (fundo translúcido, mais forte que o hover). Testado: ao rolar de "Quem sou" até "Avaliações", o item ativo do menu acompanhou corretamente.

### 🟢 12. Sem respeito a `prefers-reduced-motion` — ✅ Resolvido

- **Correção:** bloco `@media (prefers-reduced-motion: reduce)` desativando `scroll-behavior:smooth` e reduzindo toda `animation`/`transition` do site a 0,01ms — padrão amplamente recomendado que não exige tocar em cada regra de transição individualmente.

### Achado adicional (fora da numeração original): estética do card de CTA científico

Depois da correção do item 5, o gradiente do card "Acesse a produção científica completa" ficou visualmente "achatado" (as duas cores do gradiente ficaram próximas demais). Foram produzidas 3 alternativas para comparação visual e o Arliones escolheu a opção "cartão claro": o card passou a usar a mesma linguagem visual dos cards de publicação ao lado (fundo branco, borda esquerda colorida, selo circular com seta), eliminando de vez o risco de contraste do bloco escuro e integrando melhor o card ao grid.

---

## Tabela de conformidade — critérios WCAG 2.1/2.2 nível A e AA verificados

| Critério | Nível | Status | Achado relacionado |
|---|---|---|---|
| 1.1.1 Conteúdo não textual | A | ✅ Atende | #10 (reforçado) |
| 1.3.1 Informações e relações | A | ✅ Atende | — |
| 1.4.3 Contraste (mínimo) | AA | ✅ Atende (6,4–8,0:1) | #5 |
| 1.4.4 Redimensionar texto | AA | ✅ Atende | — |
| 1.4.10 Reflow | AA | ✅ Atende (não testado em navegador real) | — |
| 2.2.2 Pausar, parar, ocultar | A | ✅ Atende | #1 |
| 2.3.3 Animação por interação | AAA (extra) | ✅ Atende | #12 |
| 2.4.1 Bypass Blocks | A | ✅ Atende | Skip link |
| 2.4.4 Propósito do link (contexto) | A | ✅ Atende (reforçado) | #6 |
| 2.4.6 Cabeçalhos e rótulos | AA | ✅ Atende | — |
| 2.4.7 Foco visível | AA | ✅ Atende (customizado e testado) | #7 |
| 2.5.8 Tamanho do alvo (mínimo) | AA | ✅ Atende | #2 |
| 3.1.1 Idioma da página | A | ✅ Atende | — |
| 3.1.2 Idioma de trechos | AA | ✅ Atende (títulos/nomes próprios isentos) | — |
| 4.1.2 Nome, função, valor | A | ✅ Atende | — |
| 4.1.3 Mensagens de status | AA | ✅ Atende | #4 |

---

## Próximos passos recomendados

1. Rodar uma auditoria automatizada (axe DevTools ou Lighthouse) sobre a página **publicada** (não só local) como checagem final independente — as correções acima foram validadas manualmente em Chromium, uma ferramenta automatizada pode pegar algo que passou despercebido.
2. Repetir esta análise sempre que uma seção nova for adicionada (ex.: quando as pendências de conteúdo do `TODO.md` forem resolvidas — testemunhos reais, logo em alta resolução, etc.), já que novas seções tendem a reintroduzir os mesmos padrões (cards, carrosséis, gradientes) que motivaram os achados aqui.
3. Ao adicionar qualquer novo componente com cor de texto sobre fundo colorido (badges, CTAs, gradientes), reaproveitar o token `--a11y-accent` ou recalcular o contraste antes de publicar — foi a causa raiz do achado #5.
