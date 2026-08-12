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
  const carousel = document.getElementById('carouselAvaliacoes');

  if (!track || !dotsWrap || !btnPrev || !btnNext || !carousel) return;

  const slides = Array.from(track.children);
  let indiceAtual = 0;
  let autoplayId = null;
  const INTERVALO_AUTOPLAY = 6000;

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

  function reiniciarAutoplay() {
    pararAutoplay();
    iniciarAutoplay();
  }

  btnNext.addEventListener('click', function () {
    proximo();
    reiniciarAutoplay();
  });

  btnPrev.addEventListener('click', function () {
    anterior();
    reiniciarAutoplay();
  });

  // Pausa o autoplay ao passar o mouse ou focar no carrossel
  carousel.addEventListener('mouseenter', pararAutoplay);
  carousel.addEventListener('mouseleave', iniciarAutoplay);
  carousel.addEventListener('focusin', pararAutoplay);
  carousel.addEventListener('focusout', iniciarAutoplay);

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
    iniciarAutoplay();
  }, { passive: true });

  atualizar();
  iniciarAutoplay();
});
