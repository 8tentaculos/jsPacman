import Game from './js/Game.js';

(() => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    new Game({
        el : document.querySelector('.js-pacman-playground'),
        width : vw * 0.9,
        height : vh * 0.9,
        position : 'relative'
    });
})();
