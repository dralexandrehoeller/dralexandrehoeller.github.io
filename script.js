(function () {
    'use strict';

    // Mede a altura real do header sticky (a topbar pode quebrar linha em
    // telas estreitas) e mantém a variável usada pelo scroll-margin-top
    // das seções, para que o cabeçalho fixo não cubra o topo do conteúdo
    // ao clicar em um link do menu.
    var cabecalho = document.querySelector('header');

    function atualizarAlturaCabecalho() {
        if (cabecalho) {
            document.documentElement.style.setProperty(
                '--altura-cabecalho',
                cabecalho.offsetHeight + 'px'
            );
        }
    }

    atualizarAlturaCabecalho();
    window.addEventListener('resize', atualizarAlturaCabecalho);
    window.addEventListener('load', atualizarAlturaCabecalho);

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(atualizarAlturaCabecalho);
    }
})();

(function () {
    'use strict';

    var botao = document.querySelector('.menu-alternar');
    var lista = document.getElementById('menu-lista');

    if (!botao || !lista) {
        return;
    }

    function abrir() {
        lista.classList.add('aberto');
        botao.setAttribute('aria-expanded', 'true');
        botao.setAttribute('aria-label', 'Fechar menu');
    }

    function fechar() {
        lista.classList.remove('aberto');
        botao.setAttribute('aria-expanded', 'false');
        botao.setAttribute('aria-label', 'Abrir menu');
    }

    function alternar() {
        if (lista.classList.contains('aberto')) {
            fechar();
        } else {
            abrir();
        }
    }

    botao.addEventListener('click', alternar);

    lista.addEventListener('click', function (evento) {
        if (evento.target.closest('a')) {
            fechar();
        }
    });

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape' && lista.classList.contains('aberto')) {
            fechar();
            botao.focus();
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 860) {
            fechar();
        }
    });
})();
