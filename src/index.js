// Images
import './img/bots.png';
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

    const game = new Game({
        window,
        el : container.querySelector('.js-pacman-playground'),
        w : container.clientWidth - 12,
        h : container.clientHeight - 12
    });

});
