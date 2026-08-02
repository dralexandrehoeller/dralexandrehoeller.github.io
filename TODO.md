# Pendências para o Dr. Alexandre

Lista do que precisa da sua decisão ou dos seus arquivos definitivos antes de este
branch (`redesign/reestruturacao-2026-08`) ir para produção. Nada aqui foi decidido
por conta própria sem sinalizar — o texto de todas as seções foi reaproveitado da
versão anterior do site (commit `be238e8`) ou dos seus próprios commits mais
recentes; nenhum conteúdo novo foi inventado.

## 1. Relação entre "PlenaMente Saúde e Gestão" e "Ultralitho Centro Médico"

Você me passou `~/Downloads/plenamente.png` como "o logo da empresa do médico" — usei
esse logo (recortado, `img/logo-plenamente-emblema.png`) como o ícone principal do
site (aba do navegador e cabeçalho). Mas o conteúdo existente (topbar, seção de
contato) continua referenciando **Ultralitho Centro Médico** como o local de
atendimento presencial, sem imagem de logo (ficou como texto estilizado, já que o
antigo `logo-ultralitho.png` era um arquivo vazio).

**Preciso que você confirme:** PlenaMente é a marca/identidade do seu consultório
(e portanto o logo correto para o site todo), e Ultralitho é apenas o nome do local
físico onde você atende presencialmente? Ou são coisas diferentes que preciso tratar
de outro jeito?

## 2. Logo em alta resolução

`plenamente.png` está em baixa resolução (320×250px). Usei como placeholder — está
visivelmente um pouco granulado no favicon e no ícone do cabeçalho. Assim que tiver
uma versão em alta resolução (ideal: SVG vetorial ou PNG grande com fundo
transparente), eu substituo em `img/logo-plenamente.png` e regenero os favicons.

## 3. Logo do Ultralitho Centro Médico

Removido o arquivo vazio `img/logo-ultralitho.png` que só quebrava a página. Por
enquanto o nome aparece como texto. Se quiser a marca do Ultralitho no site, me
mande o arquivo e eu insiro no lugar certo (topbar e cartão de contato).

## 4. Foto de perfil

O `img/foto.jpg` atual estava vazio (1 byte). Recuperei do histórico do git (commit
`53d1e1f`) uma foto real sua no consultório, de jaleco e estetoscópio, e é essa que
está no ar agora como placeholder.

**Ponto de atenção de privacidade:** nessa foto aparece, ao fundo, um monitor com uma
lista em uma tela de sistema (parece prontuário/agenda). Na resolução usada no site
não dá para ler nomes ou dados com clareza, mas antes de publicar recomendo que você
confirme que não há informação de paciente identificável visível — e, se preferir,
substitua por uma foto sem tela de computador ao fundo, ou uma foto de estúdio.

## 5. Números de WhatsApp — divergência entre versões

O histórico do site tinha dois números diferentes para "presencial":
- Versão mais recente sua (commit `cb433f6`): `554832080093` para tudo (presencial,
  teleconsulta e Ultralitho).
- Versão anterior (commit `be238e8`): `554821088888` especificamente para o
  Ultralitho presencial, e `554832080093` só para teleconsulta.

Usei o número único (`554832080093`) em todo o site, por ser a sua edição mais
recente — mas não tenho como saber se isso foi intencional ou um esquecimento seu ao
editar. Confirme qual número é o correto para cada modalidade.

## 6. Seção "Avaliações"

O item "Avaliações" já estava no menu (adicionado por você no commit `cb433f6`), mas
nunca existiu conteúdo para essa seção em nenhuma versão do site. Como conteúdo é
responsabilidade sua, não inventei depoimentos — a seção hoje só tem uma frase
genérica e o botão para o seu perfil de avaliações no Google (reaproveitado do botão
"⭐ Avaliações no Google" que já existia na hero antiga). Se quiser depoimentos reais
publicados diretamente na página, me envie os textos (com autorização dos pacientes)
que eu monto o layout.

## 7. Revisão geral de texto

Todo o texto das seções (Áreas de atuação, Minha forma de cuidar, Sobre, Como
funciona a consulta, Pesquisa, Contato, Rodapé) foi copiado literalmente da versão
anterior mais completa do site (`be238e8`). Vale uma revisão sua linha a linha para
confirmar que ainda reflete sua prática atual — não alterei nada além do necessário
para corrigir a estrutura.

## 8. Itens técnicos corrigidos nesta reestruturação (para seu conhecimento)

- HTML estava incompleto (faltavam todas as seções depois da hero, e as tags de
  fechamento) — reconstruído por completo.
- `@media` de responsividade em `style.css` estava mal fechado e aplicava estilos de
  celular em qualquer tamanho de tela — corrigido.
- Havia dois `<section id="contato">` duplicados na versão antiga — unificados em
  um só.
- Ícones eram arquivos SVG/PNG vazios (1 byte) — recriados como SVG inline no
  próprio HTML, sem depender de arquivos externos.
- `script.js` estava vazio e sem uso — removido.
- Adicionado favicon (gerado a partir do emblema do logo PlenaMente), `robots.txt`,
  `sitemap.xml` e dados estruturados (JSON-LD `Physician`) para SEO técnico.
