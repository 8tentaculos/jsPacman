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

import $ from 'jquery';
import Game from './js/Game';

$(function() {
    const container = $('.js-pacman');

    const game = new Game({
        el : container.find('.playground'),
        w : container.width(),
        h : container.height()
    });
});
