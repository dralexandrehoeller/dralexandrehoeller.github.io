# Análise de IHC e Acessibilidade (nível AA) — dralexandrehoeller.github.io

**Data da análise:** 15/08/2026
**Escopo:** `index.html`, `style.css`, `script.js` (site estático, sem back-end/formulários)
**Metodologia:** Avaliação heurística (Nielsen) + verificação de conformidade com as Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.1/2.2, nível **AA** (que exige o cumprimento cumulativo de todos os critérios de Nível A + Nível AA). A revisão foi feita por leitura de código; itens que dependem de renderização real (zoom 400%, leitores de tela, contraste pixel-a-pixel) estão sinalizados como "a validar" com ferramenta automatizada.

---

## Resumo executivo

O site está **bem acima da média** de projetos deste porte em acessibilidade: já traz skip link, landmarks semânticos, hierarquia de headings consistente, `lang="pt-BR"`, ícones decorativos corretamente ocultados de leitores de tela e um menu mobile com `aria-expanded`/`aria-label` dinâmicos — sinais de que a acessibilidade foi pensada desde o início, não só "encaixada" depois.

Os pontos que impedem hoje uma conformidade AA completa se concentram quase todos em **um único componente: o carrossel de avaliações**. Fora dele, os achados são majoritariamente de refinamento (contraste no limite, textos truncados, pequenas melhorias de leitura por teclado/leitor de tela).

| Prioridade | Nº de achados |
|---|---|
| 🔴 Alta (bloqueia conformidade AA) | 2 |
| 🟡 Média | 4 |
| 🟢 Baixa (refinamento) | 5 |

---

## Pontos fortes já implementados

- **Skip link funcional** — `<a href="#inicio" class="skip-link">Pular para o conteúdo</a>` (`index.html:67`), visível ao receber foco (`style.css:90-92`).
- **Landmarks semânticos completos** — `<header>`, `<nav>`, `<main>`, `<footer>` (não `<div>`s genéricas), o que dá navegação por regiões a quem usa leitor de tela.
- **Um único `<h1>`** na página, com hierarquia `h2 > h3` consistente em todas as seções — nenhum salto de nível encontrado.
- **`lang="pt-BR"`** declarado no `<html>` (`index.html:2`) — critério 3.1.1 (Nível A), pré-requisito para conformidade AA.
- **Ícones decorativos corretamente ocultados** (`aria-hidden="true"`) sempre acompanhados de texto visível equivalente (ex.: SVG do WhatsApp + "Agende uma consulta").
- **Estrelas de avaliação com semântica correta** — `role="img" aria-label="Nota 5,0 de 5 estrelas"` em vez de apenas caracteres `★` soltos.
- **Menu hamburguer acessível** — alterna `aria-expanded` e o próprio `aria-label` do botão conforme o estado (`script.js:12-19`), e os links ficam corretamente fora da árvore de tabulação quando o menu está fechado (`display:none`).
- **Viewport sem bloqueio de zoom** — `content="width=device-width, initial-scale=1.0"` (`index.html:6`), sem `user-scalable=no` nem `maximum-scale`, o que preserva o zoom do usuário (essencial para 1.4.4 e 1.4.10).
- **Contraste de texto muito bom na maior parte do conteúdo** — o texto principal (`#333333` sobre fundo claro) mede ≈12,6:1, e o texto secundário (`#666666`) ≈5,5–5,8:1 conforme o fundo — ambos folgados acima do mínimo de 4,5:1 exigido para texto normal.
- **Links externos com `rel="noopener noreferrer"`** em todas as ocorrências — boa prática de segurança que também evita comportamento inesperado de navegação.

---

## 🔴 Achados de alta prioridade

### 1. Carrossel de avaliações roda automaticamente sem controle de pausa acessível a todos os usuários

- **Onde:** `script.js:81-94` (autoplay a cada 6s) e `script.js:106-110` (pausa apenas em `mouseenter`/`focusin`)
- **Critério WCAG:** 2.2.2 *Pause, Stop, Hide* (Nível A — obrigatório para conformidade AA, pois AA exige A+AA)
- **Problema:** o conteúdo se move automaticamente por mais de 5 segundos, e a única forma de pausá-lo é passar o mouse por cima ou dar foco a um elemento dentro do carrossel. Isso não ajuda quem usa **toque** (mobile): o `touchend` sempre rechama `iniciarAutoplay()` (`script.js:119-126`), então o carrossel nunca fica pausado de forma persistente em um celular. Também não ajuda quem navega só por teclado sem chegar a focar um controle interno antes do texto mudar.
- **Impacto real:** pessoas com dificuldade de leitura, baixa visão ou distúrbios de atenção podem não conseguir terminar de ler um depoimento antes que ele mude — e no celular (o dispositivo mais comum para esse tipo de site) não há como parar a troca automática de forma confiável.
- **Recomendação:** adicionar um botão visível "Pausar"/"Reproduzir" (ícone ⏸/▶) próximo às setas, com estado persistente — e não retomar o autoplay automaticamente após uma interação de toque, apenas após um novo período de inatividade real.

### 2. Indicadores (dots) do carrossel abaixo do tamanho mínimo de toque

- **Onde:** `.carousel-dot` — `style.css:901-910` (9×9px, `gap:8px` entre eles)
- **Critério WCAG:** 2.5.8 *Target Size (Minimum)* (Nível AA, WCAG 2.2) — exige no mínimo 24×24px CSS, ou espaçamento suficiente entre alvos menores para que seus centros fiquem a pelo menos 24px de distância.
- **Problema:** os dots medem 9×9px com apenas 8px de espaçamento — a distância entre centros fica em torno de 17px, abaixo dos 24px exigidos mesmo pela exceção de espaçamento. Não há atributos como `title` compensando o alvo pequeno.
- **Impacto real:** em telas de toque, esses botões são difíceis de acertar com precisão, especialmente para usuários com tremor, baixa destreza motora ou simplesmente dedos maiores.
- **Recomendação:** manter o círculo visual pequeno (é um bom indicador visual), mas aumentar a **área clicável** para 24×24px via `padding` ou um pseudo-elemento `::before` maior que a bolinha visível, sem alterar o layout visual.

---

## 🟡 Achados de prioridade média

### 3. Depoimentos longos são cortados visualmente sem forma de ler o restante

- **Onde:** `.avaliacao-card` com altura fixa (`height:172px`, `190px` no mobile) + `.avaliacao-texto` com `-webkit-line-clamp:4` (`style.css:826-837`, `846-856`)
- **Problema:** avaliações mais longas (ex.: o depoimento de "D.B.", `index.html:460`, ou de "P.C.", `index.html:417`) são cortadas na 4ª linha sem reticências consistentes entre navegadores nem um link "ler mais". Curiosamente, o texto completo continua no HTML e **é lido integralmente por leitores de tela** — ou seja, hoje quem usa leitor de tela recebe mais informação do que quem vê a tela, o que é um sinal de inconsistência de conteúdo entre modalidades.
- **Impacto real:** usuários videntes não conseguem avaliar a experiência completa relatada pelos pacientes — justamente o conteúdo que mais gera confiança na página.
- **Recomendação:** ou aumentar a altura do card para acomodar o texto mais longo do conjunto, ou adicionar um botão "Ler depoimento completo" que expande o card (mantendo o texto sempre presente e legível, não escondido atrás de comportamento só-para-leitor-de-tela).

### 4. Nenhum aviso de status ao trocar de depoimento no carrossel

- **Onde:** `#carouselTrack` (`index.html:405`), atualizado via `atualizar()` em `script.js:61-66`
- **Critério WCAG:** 4.1.3 *Status Messages* (Nível AA)
- **Problema:** a troca de slide (por autoplay, setas ou dots) não é anunciada a quem usa leitor de tela — não há `aria-live` nem `role="status"` associado à região que muda.
- **Recomendação:** envolver a região do depoimento ativo (ou um texto oculto visualmente do tipo "Avaliação 3 de 15") em um contêiner com `aria-live="polite"`, atualizado a cada troca de slide.

### 5. Contraste no limite mínimo em dois elementos

- **Onde:**
  - `.destaque` (badge "CRM/SC 34061" no hero, `index.html:129`) — cor `var(--primary-light)` (`#3D7B6A`) sobre `var(--bg-body)` (`#FAFAF7`), `style.css:320-325`. Cálculo estimado: **≈4,77:1** (mínimo exigido: 4,5:1 para texto normal).
  - `.publicacao-cta-texto` (card "Acesse a produção científica completa", `index.html:364-366`) — texto branco sobre gradiente `--primary → --primary-light` (`style.css:655-679`). No ponto mais claro do gradiente, o contraste estimado cai para **≈4,53:1**.
- **Critério WCAG:** 1.4.3 *Contrast (Minimum)* (Nível AA)
- **Problema:** ambos os valores foram calculados manualmente e ficam tecnicamente acima do mínimo, mas com margem muito pequena — qualquer variação de renderização de fonte, sub-pixel rendering ou ajuste futuro de cor pode empurrá-los para reprovação.
- **Recomendação:** validar com uma ferramenta de contraste real (ex.: extensão axe DevTools, Lighthouse ou WebAIM Contrast Checker) e, por segurança, escurecer levemente `--primary-light` (ex.: para `#356B5C`) ou aplicar o texto do CTA apenas sobre a cor `--primary` sólida (mais escura), sem gradiente na área do texto.

### 6. Links repetidos "Ver artigo →" sem nome acessível distinto

- **Onde:** 8 ocorrências idênticas na seção "Ciência" (`index.html:263, 277, 291, 305, 319, 333, 347, 361`)
- **Critério WCAG:** 2.4.4 *Link Purpose (In Context)* (Nível A) — tecnicamente atendido, pois o título do artigo precede cada link dentro do mesmo `<article>`. Mas é uma prática frágil.
- **Problema:** ferramentas de leitor de tela costumam oferecer navegação "por lista de links", que extrai os links da página fora do contexto visual. Nessa lista, um usuário ouviria "Ver artigo", repetido 8 vezes seguidas, sem saber a qual publicação cada um se refere.
- **Recomendação:** adicionar `aria-label` a cada link reforçando o artigo, por exemplo `aria-label="Ver artigo: Hippocampus-dependent fear conditioning..."`, mantendo o texto visível "Ver artigo →" inalterado.

---

## 🟢 Achados de baixa prioridade (refinamento)

### 7. Estilo de foco de teclado não customizado

- **Onde:** nenhuma regra `:focus` ou `:focus-visible` além de `.skip-link:focus` (`style.css:90-92`)
- **Critério WCAG:** 2.4.7 *Focus Visible* (Nível AA)
- **Observação:** o navegador aplica um contorno padrão (geralmente azul), então o critério **não está tecnicamente violado**. Mas em elementos sobre o fundo verde do cabeçalho (`.nav-link`) ou sobre cards brancos com sombra sutil, o anel de foco padrão pode ficar pouco perceptível dependendo do navegador/SO.
- **Recomendação:** definir um `:focus-visible` explícito e de alto contraste (ex.: contorno de 2-3px na cor de destaque, com `outline-offset`), garantindo consistência visual em todos os navegadores e blindando o site contra qualquer futura regra que remova o outline padrão sem querer.

### 8. Textos muito pequenos nos cards de publicação

- **Onde:** `.publicacao-tag` (`font-size:0.58rem` ≈ 9,3px, `style.css:590-601`) e `.publicacao-revista-meta` (`font-size:0.66rem` ≈ 10,6px, `style.css:585-588`)
- **Observação:** o contraste de cor está adequado e o uso de `rem` preserva o zoom do navegador, então não há violação formal de WCAG. Mas abaixo de ~12px a leitura fica desconfortável para grande parte dos usuários, especialmente pessoas com baixa visão que não chegam a aplicar zoom.
- **Recomendação:** elevar esses dois elementos para pelo menos `0.72rem`–`0.75rem` (~11,5–12px), redistribuindo o espaço do card se necessário.

### 9. Depoimento duplicado

- **Onde:** o depoimento de "C.M." ("Profissional humano e atencioso. Recomendo a todos.") aparece **duas vezes**, em `index.html:488-489` e `index.html:572-573`.
- **Observação:** não é um problema de acessibilidade técnica, mas de qualidade de conteúdo — reduz a credibilidade da seção de avaliações e pode ser notado por um paciente atento.
- **Recomendação:** remover uma das duas ocorrências ou substituí-la por outra avaliação real do Google.

### 10. `alt` da foto do herói é minimalista

- **Onde:** `<img src="img/foto1.jpg" alt="Dr. Alexandre A. Hoeller">` (`index.html:124`)
- **Observação:** tecnicamente válido (1.1.1, Nível A), mas descreve apenas quem aparece, não o que a imagem comunica.
- **Recomendação:** um `alt` levemente mais descritivo ajuda quem usa leitor de tela a ter a mesma primeira impressão que um usuário vidente — ex.: `alt="Dr. Alexandre A. Hoeller, médico, sorrindo, vestindo jaleco branco"` (ajustar à foto real).

### 11. Sem indicação da seção ativa durante a rolagem

- **Onde:** `.nav-link` (`index.html:105-112`) — nenhum dos links recebe uma classe ou `aria-current="true"` conforme a seção visível muda.
- **Observação:** não é exigência do WCAG AA, mas é uma heurística de usabilidade (Nielsen: *visibilidade do status do sistema*) importante numa página de rolagem longa com 8 itens de menu.
- **Recomendação:** usar `IntersectionObserver` para aplicar `aria-current="true"` (e um estilo visual correspondente) ao link da seção atualmente visível.

### 12. Sem respeito a `prefers-reduced-motion`

- **Onde:** `html{scroll-behavior:smooth}` (`style.css:29-31`) e diversas transições de `transform` em hover (cards, botões, ícone social)
- **Observação:** critério de nível AAA (2.3.3), não obrigatório para conformidade AA — incluído aqui como melhoria de conforto, não como não-conformidade.
- **Recomendação:** envolver `scroll-behavior:smooth` e as animações de translação em `@media (prefers-reduced-motion: no-preference) { ... }`, beneficiando usuários com sensibilidade a movimento sem custo para os demais.

---

## Tabela de conformidade — critérios WCAG 2.1/2.2 nível A e AA verificados

| Critério | Nível | Status | Achado relacionado |
|---|---|---|---|
| 1.1.1 Conteúdo não textual | A | ✅ Atende | — |
| 1.3.1 Informações e relações | A | ✅ Atende | — |
| 1.4.3 Contraste (mínimo) | AA | ⚠️ Verificar | #5 |
| 1.4.4 Redimensionar texto | AA | ✅ Atende | — |
| 1.4.10 Reflow | AA | ✅ Atende (não testado em navegador real) | — |
| 2.2.2 Pausar, parar, ocultar | A | ❌ Não atende | #1 |
| 2.4.1 Bypass Blocks | A | ✅ Atende | Skip link |
| 2.4.4 Propósito do link (contexto) | A | ⚠️ Frágil | #6 |
| 2.4.6 Cabeçalhos e rótulos | AA | ✅ Atende | — |
| 2.4.7 Foco visível | AA | ✅ Atende (padrão do navegador) | #7 |
| 2.5.8 Tamanho do alvo (mínimo) | AA | ❌ Não atende | #2 |
| 3.1.1 Idioma da página | A | ✅ Atende | — |
| 3.1.2 Idioma de trechos | AA | ✅ Atende (títulos/nomes próprios isentos) | — |
| 4.1.2 Nome, função, valor | A | ✅ Atende | — |
| 4.1.3 Mensagens de status | AA | ❌ Não atende | #4 |

---

## Próximos passos recomendados

1. Resolver os dois achados 🔴 do carrossel primeiro — são os únicos que hoje impedem a conformidade formal com AA.
2. Rodar uma auditoria automatizada (axe DevTools ou Lighthouse) sobre a página publicada para confirmar os contrastes calculados manualmente (#5) e capturar qualquer regressão futura.
3. Tratar os itens 🟡 e 🟢 como um backlog de polimento — nenhum deles bloqueia lançamento, mas juntos elevam a experiência de leitura e a confiança na página (especialmente #3 e #9, que afetam diretamente a seção de avaliações).
4. Repetir esta análise sempre que uma seção nova for adicionada (ex.: quando as pendências de conteúdo do `TODO.md` forem resolvidas), já que novas seções tendem a reintroduzir os mesmos padrões (cards, carrosséis, gradientes).
