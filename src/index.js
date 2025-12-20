import Game from './js/Game.js';

window.addEventListener('load', () => {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

    class GameWithPosition extends Game {
        constructor(options) {
            super(options);
            this.el.style.left = '50%';
            this.el.style.marginLeft = `-${this.el.offsetWidth / 2}px`;
            this.el.style.top = '50%';
            this.el.style.marginTop = `-${this.el.offsetHeight / 2}px`;
        }
    }

    new GameWithPosition({
        el : document.querySelector('.js-pacman-playground'),
        width : vw * 0.9,
        height : vh * 0.9
    });
});
