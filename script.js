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
});
