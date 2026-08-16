// ===================================================
// Dr. Alexandre A. Hoeller
// script.js — menu mobile (hamburguer)
// ===================================================

document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', function () {
    const aberto = navMenu.classList.toggle('aberto');
    menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    menuToggle.setAttribute(
      'aria-label',
      aberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
    );
  });

  // Fecha o menu ao clicar em um link (útil no mobile)
  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('aberto');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    });
  });

  // ===================================================
  // Carrossel de avaliações (Google)
  // ===================================================
  const track = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const btnPrev = document.getElementById('carouselPrev');
  const btnNext = document.getElementById('carouselNext');
  const btnPausa = document.getElementById('carouselPausa');
  const carousel = document.getElementById('carouselAvaliacoes');
  const status = document.getElementById('carouselStatus');

  if (!track || !dotsWrap || !btnPrev || !btnNext || !btnPausa || !carousel) return;

  const slides = Array.from(track.children);
  let indiceAtual = 0;
  let autoplayId = null;
  let pausadoPeloUsuario = false;
  const INTERVALO_AUTOPLAY = 6000;
  const ICONE_PAUSAR = '⏸';
  const ICONE_RETOMAR = '▶';

  // Modal de depoimento completo
  const modal = document.getElementById('avaliacaoModal');
  const modalFechar = document.getElementById('avaliacaoModalFechar');
  const modalEstrelas = document.getElementById('avaliacaoModalEstrelas');
  const modalTexto = document.getElementById('avaliacaoModalTexto');
  const modalAutor = document.getElementById('avaliacaoModalAutor');
  let elementoFocoAnterior = null;
  let modalAberto = false;

  // Cria os indicadores (dots)
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.classList.add('carousel-dot');
    dot.setAttribute('aria-label', 'Ir para avaliação ' + (i + 1));
    if (i === 0) dot.classList.add('ativo');
    dot.addEventListener('click', function () {
      irPara(i);
      reiniciarAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function atualizar() {
    track.style.transform = 'translateX(-' + (indiceAtual * 100) + '%)';
    dots.forEach(function (dot, i) {
      dot.classList.toggle('ativo', i === indiceAtual);
    });
    if (status) {
      const autor = slides[indiceAtual].querySelector('.avaliacao-autor');
      status.textContent = 'Avaliação ' + (indiceAtual + 1) + ' de ' + slides.length +
        (autor ? ', de ' + autor.textContent.trim() : '');
    }
  }

  function irPara(indice) {
    indiceAtual = (indice + slides.length) % slides.length;
    atualizar();
  }

  function proximo() {
    irPara(indiceAtual + 1);
  }

  function anterior() {
    irPara(indiceAtual - 1);
  }

  function iniciarAutoplay() {
    if (slides.length <= 1) return;
    pararAutoplay();
    autoplayId = setInterval(proximo, INTERVALO_AUTOPLAY);
  }

  function pararAutoplay() {
    clearInterval(autoplayId);
  }

  // Só retoma o autoplay automaticamente se o usuário não o tiver pausado
  // deliberadamente pelo botão de pausa (WCAG 2.2.2 — Pause, Stop, Hide) nem
  // se o modal de depoimento completo estiver aberto
  function reiniciarAutoplay() {
    pararAutoplay();
    if (!pausadoPeloUsuario && !modalAberto) iniciarAutoplay();
  }

  // ===================================================
  // Depoimento completo (modal) — abrir sempre pausa o
  // carrossel; ele só volta a girar quando o modal fecha
  // ===================================================
  function abrirModalAvaliacao(estrelas, texto, autor, gatilho) {
    if (!modal || !modalFechar || !modalEstrelas || !modalTexto || !modalAutor) return;

    elementoFocoAnterior = gatilho;
    modalEstrelas.innerHTML = estrelas ? estrelas.innerHTML : '';
    modalEstrelas.setAttribute('aria-label', estrelas ? (estrelas.getAttribute('aria-label') || '') : '');
    modalTexto.textContent = texto;
    modalAutor.textContent = autor;

    modalAberto = true;
    pararAutoplay();

    modal.hidden = false;
    document.addEventListener('keydown', aoTeclarNoModal);
    modalFechar.focus();
  }

  function fecharModalAvaliacao() {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.removeEventListener('keydown', aoTeclarNoModal);
    modalAberto = false;
    reiniciarAutoplay();

    if (elementoFocoAnterior) elementoFocoAnterior.focus();
    elementoFocoAnterior = null;
  }

  // Foco preso no modal: só há um elemento focável (o botão de fechar)
  function aoTeclarNoModal(e) {
    if (e.key === 'Escape') {
      fecharModalAvaliacao();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      modalFechar.focus();
    }
  }

  if (modal && modalFechar) {
    modalFechar.addEventListener('click', fecharModalAvaliacao);
    modal.querySelectorAll('[data-fechar-avaliacao-modal]').forEach(function (el) {
      el.addEventListener('click', fecharModalAvaliacao);
    });
  }

  // Adiciona, a cada avaliação cujo texto foi visualmente cortado (line-clamp),
  // um botão "Ler mais" que abre o depoimento completo no modal
  function configurarLeituraCompleta() {
    if (!modal) return;

    slides.forEach(function (card) {
      const texto = card.querySelector('.avaliacao-texto');
      const autor = card.querySelector('.avaliacao-autor');
      const estrelas = card.querySelector('.nota-estrelas');
      if (!texto || !autor) return;

      let botao = card.querySelector('.avaliacao-ler-mais');
      if (!botao) {
        const rodape = document.createElement('div');
        rodape.className = 'avaliacao-rodape';
        autor.parentNode.insertBefore(rodape, autor);
        rodape.appendChild(autor);

        botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'avaliacao-ler-mais';
        botao.textContent = 'Ler mais';
        botao.hidden = true;
        rodape.appendChild(botao);

        botao.addEventListener('click', function () {
          abrirModalAvaliacao(estrelas, texto.textContent.trim(), autor.textContent.trim(), botao);
        });
      }

      botao.setAttribute('aria-label', 'Ler depoimento completo de ' + autor.textContent.trim());
      botao.hidden = texto.scrollHeight <= texto.clientHeight + 1;
    });
  }

  function definirEstadoPausa(pausado) {
    pausadoPeloUsuario = pausado;
    btnPausa.setAttribute('aria-pressed', pausado ? 'true' : 'false');
    btnPausa.setAttribute(
      'aria-label',
      pausado ? 'Retomar avaliações automáticas' : 'Pausar avaliações automáticas'
    );
    const icone = btnPausa.querySelector('.carousel-pausa-icone');
    if (icone) icone.textContent = pausado ? ICONE_RETOMAR : ICONE_PAUSAR;

    if (pausado) {
      pararAutoplay();
    } else {
      iniciarAutoplay();
    }
  }

  btnPausa.addEventListener('click', function () {
    definirEstadoPausa(!pausadoPeloUsuario);
  });

  btnNext.addEventListener('click', function () {
    proximo();
    reiniciarAutoplay();
  });

  btnPrev.addEventListener('click', function () {
    anterior();
    reiniciarAutoplay();
  });

  // Pausa temporariamente o autoplay ao passar o mouse ou focar no carrossel;
  // ao sair, só retoma se o usuário não tiver pausado deliberadamente
  carousel.addEventListener('mouseenter', pararAutoplay);
  carousel.addEventListener('mouseleave', reiniciarAutoplay);
  carousel.addEventListener('focusin', pararAutoplay);
  carousel.addEventListener('focusout', reiniciarAutoplay);

  // Suporte a swipe (toque) em telas mobile
  let startX = 0;
  track.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    pararAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? proximo() : anterior();
    }
    reiniciarAutoplay();
  }, { passive: true });

  atualizar();
  iniciarAutoplay();
  configurarLeituraCompleta();

  // Recalcula quais depoimentos precisam do botão "Ler mais" quando a fonte
  // termina de carregar ou a largura da tela muda (a altura do texto varia)
  window.addEventListener('load', configurarLeituraCompleta);

  let redimensionamentoId = null;
  window.addEventListener('resize', function () {
    clearTimeout(redimensionamentoId);
    redimensionamentoId = setTimeout(configurarLeituraCompleta, 200);
  });
});
