// Images
import './img/characters.png';
import './img/maze.png';
import './img/misc.png';
import './img/pills.png';
// Audio
import './audio/back.mp3';
import './audio/bonus.mp3';
import './audio/dead.mp3';
import './audio/dot.mp3';
import './audio/eat.mp3';
import './audio/eaten.mp3';
import './audio/frightened.mp3';
import './audio/intro.mp3';
import './audio/life.mp3';
// CSS
import './styles.css';

import Game from './js/Game';

window.addEventListener('load', (event) => {
    const container = document.querySelector('.js-pacman-container');

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

    const game = new GameWithPosition({
        el : document.querySelector('.js-pacman-playground'),
        width : vw * 0.9,
        height : vh * 0.9
    });

});
