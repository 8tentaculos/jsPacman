import Game from './engine/Game';
import SoundManager from './SoundManager';
import Map from './Map';
import GameModel from './GameModel';
import makeGhost from './factory/makeGhost';
import makeDot from './factory/makeDot';
import makePill from './factory/makePill';
import makeBonus from './factory/makeBonus';
import Pacman from './Pacman';
import Lives from './Lives';
import Bonuses from './Bonuses';

import { EVENT_KEY_DOWN, KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT } from './engine/Keyboard';
import { EVENT_SWIPE, EVENT_SWIPE_UP, EVENT_SWIPE_RIGHT, EVENT_SWIPE_DOWN, EVENT_SWIPE_LEFT } from './engine/Touch';

const show = el => { el.style.display = ''; }
const hide = el => { el.style.display = 'none'; }

const defaults = {
    // Options.
    width : 896 / 2,
    height : 1152 / 2,
    originalWidth : 896,
    originalHeight : 1152,

    dotScore : 10,
    pillScore : 50,
    defaultLives : 3,
    soundEnabled : true,

    events : {
        'click .start' : 'startLevel'
    }
};

class JsPacman extends Game {
    constructor(options = {}) {
        super(options);

        Object.keys(defaults).forEach(key => {
            if (key in options) this[key] = options[key];
        });

        this.model = new GameModel({
            lives : this.defaultLives
        });

        this.model.fetch();

        this.render();

        this.elements = {
            splash : this.$('.splash'),
            start : this.$('.start'),
            startP1 : this.$('.start-p1'),
            startReady : this.$('.start-ready'),
            highScore : this.$('.high-score span'),
            score : this.$('.p1-score span'),
            gameOver : this.$('.game-over'),
            soundStatus : this.$('.sound-status'),
            paused : this.$('.paused'),
            load : this.$('.loadbar')
        };

        this.keyboard.on(EVENT_KEY_DOWN, this._onKeyDown.bind(this));

        this.touch.on(EVENT_SWIPE, this._onSwipe.bind(this));

        this.sound = new SoundManager({
            soundEnabled : this.soundEnabled,
            addSound : this.addSound.bind(this)
        });

        this.lives = new Lives({
            lives : this.defaultLives + 1,
            x : 40,
            y : 1124,
            model : this.model,
            factor : this.scaling.getFactor(),
            addSprite : this.addSprite.bind(this)
        });

        this.bonuses = new Bonuses({
            level : this.model.level,
            x : 860,
            y : 1124,
            model : this.model,
            factor : this.scaling.getFactor(),
            addSprite : this.addSprite.bind(this)
        });

        this._onGhostEaten = this._onGhostEaten.bind(this);
        this._onGhostEat = this._onGhostEat.bind(this);

        this.model.on('change:score', this._onChangeScore.bind(this));
        this.model.on('change:highScore', this._onChangeHighScore.bind(this));
        this.model.on('change:lives', this._onChangeLives.bind(this));
        this.model.on('change:extraLives', this._onChangeExtraLives.bind(this));
        this.model.on('change:mode', this._onChangeMode.bind(this));

        this.makeLevel();

        this.start(() => {
            hide(this.elements.load);
            show(this.elements.start);
        });
    }

    startLevel() {
        if (this._win) {
            this.model.level++;
            this.reset();
            this._win = false;
            return;
        }

        if (this._gameOver) {
            this.model.level = 1;
            this.reset();
            this._gameOver = false;
            hide(this.elements.splash);
            this.sound.play('intro');
            return;
        }

        hide(this.elements.splash);
        this.sound.play('intro');
        this.addCallback(this.mainLoop.bind(this));
    }

    reset() {
        this.model.mode = null;

        this.pinky.destroy();
        this.blinky.destroy();
        this.inky.destroy();
        this.sue.destroy();
        this.pacman.destroy();

        this.map.destroyItems();

        this.off('game:ghost:eaten', this._onGhostEaten);
        this.off('game:ghost:eat', this._onGhostEat);

        if (!this._win) {
            this.model.lives = this.defaultLives + 1;
            this.model.score = 0;
        }

        this.keyboard.clear();

        this._inputDirection = null;
        this._lastSwipe = null;

        this.makeLevel();
    }

    makeLevel() {
        Object.assign(this, this.model.getSettings('game'));

        this.map = new Map(this.map);

        this.el.classList.remove('maze-1');
        this.el.classList.remove('maze-2');
        this.el.classList.remove('maze-3');
        this.el.classList.remove('maze-4');

        this.el.classList.add(this.maze);

        var dotAnimationLabel = 'white';
        if (this.maze === 'maze-2') dotAnimationLabel = 'yellow';
        if (this.maze === 'maze-3') dotAnimationLabel = 'red';

        this._pauseFrames = 80;

        this._destroyBonus = 0;
        this._showBonus = 500;

        var i = this.map.tiles.length, total = 0;
        while (i--) {
            var tile = this.map.tiles[i];
            if (tile.code === '.') {
                let dot = makeDot({
                    defaultAnimation : dotAnimationLabel,
                    map : this.map,
                    factor : this.scaling.getFactor(),
                    normalizeRefrashRate : this.normalizeRefrashRate.bind(this),
                    x : tile.x,
                    y : tile.y
                });
                tile.item = dot;
                this.addSprite(dot);
                total++;
            }

            if (tile.code === '*') {
                let pill = makePill({
                    defaultAnimation : dotAnimationLabel,
                    map : this.map,
                    factor : this.scaling.getFactor(),
                    normalizeRefrashRate : this.normalizeRefrashRate.bind(this),
                    x : tile.x,
                    y : tile.y
                });
                tile.item = pill;
                this.addSprite(pill);
                total++;
            }
        }

        this.totalItems = total;

        // Pacman.
        this.pacman = new Pacman({
            preturn : true,
            x : 452,
            y : 848,
            ...this.model.getSettings('pacman'),
            map : this.map,
            factor : this.scaling.getFactor(),
            normalizeRefrashRate : this.normalizeRefrashRate.bind(this),
            addGameGhostEatEventListener : listener => this.on('game:ghost:eat', listener),
            addGameGhostModeFrightenedEnter : listener => this.on('game:ghost:modefrightened:enter', listener),
            addGameGhostModeFrightenedExit : listener => this.on('game:ghost:modefrightened:exit', listener)
        });

        this.pacman.on('item:eatpill', t => {
            this._pauseFrames = 2;

            this.model.addScore(this.pillScore);

            this.totalItems--;

            if (this.totalItems === 0) {
                this.win();
            }
            else this.sound.play('frightened');
        });
        // Pacman eats ghost.
        this.on('game:ghost:eaten', this._onGhostEaten);
        // Ghost eats Pacman.
        this.on('game:ghost:eat', this._onGhostEat);
        // Pacman make die turn arround.
        this.pacman.on('item:die', (ghost) => {
            this.sound.play('eaten');
        });
        // Pacman lose.
        this.pacman.on('item:life', () => {
            this.keyboard.clear();

            this._inputDirection = null;
            this._lastSwipe = null;
            this.model.mode = null;

            this.pacman.reset();

            this.pinky.reset();
            this.blinky.reset();
            this.inky.reset();
            this.sue.reset();

            if (this.bonus) {
                this._destroyBonus = 0;
                this._showBonus = 250;
                this.bonus.reset();
                this.bonus.hide();
            }

            this.showGhosts();

            this.model.lives--;

            this._pacmanEaten = false;

            if (this.model.lives) {
                show(this.elements.startReady);
                this._start = 1;
                this._pauseFrames = 40;
            } else {
                this._pauseFrames = 120;
            }
        });
        // Pacman eats dot.
        this.pacman.on('item:eatdot', (t) => {
            this.model.addScore(this.dotScore);

            this.sound.play('dot');

            this.totalItems--;

            if (this.totalItems === 0) {
                this.win();
            }
        });

        this.addSprite(this.pacman);

        // Bonus.
        if (this.bonus) {
            this.bonus.destroy();
        }

        var bonusTile = this.map.tunnels[this.map.tunnels.length - 1];

        this.bonus = makeBonus(this.bonusIndex, {
            map : this.map,
            dir : 'l',
            score : this.bonusScore,
            x : bonusTile.x,
            y : bonusTile.y,
            factor : this.scaling.getFactor(),
            normalizeRefrashRate : this.normalizeRefrashRate.bind(this),
            addPacmanPositionEventListener : listener => this.pacman.on('item:position', listener)
        });

        // Bonus reaches target and disappears.
        this.bonus.on('item:destroy', (bonus) => {
            this.bonus.destroy();
            this.bonus = null;
        });

        // Pacman eats bonus.
        this.bonus.on('item:eaten', (bonus) => {
            if (this._showBonus) return; // Not yet in the maze
            this._pauseFrames = 5;
            this._destroyBonus = 25;
            this.model.addScore(parseInt(bonus.score));
            this.sound.play('bonus');
        });

        this.addSprite(this.bonus);

        // Ghosts.
        const ghostAttrs = {
            ...this.model.getSettings('ghost'),
            map : this.map,
            normalizeRefrashRate : this.normalizeRefrashRate.bind(this),
            factor : this.scaling.getFactor(),
            addGameGlobalModeEventListener : listener => this.on('game:globalmode', listener),
            addGameGhostEatenEventListener : listener => this.on('game:ghost:eaten', listener),
            addPacmanPositionEventListener : listener => this.pacman.on('item:position', listener),
            addPacmanEatPillEventListener : listener => this.pacman.on('item:eatpill', listener)
        };

        const pinkyTile = this.map.houseCenter.getR();

        this.pinky = makeGhost('pinky', {
            ...ghostAttrs,
            x : pinkyTile.x - this.map.tileWidth / 2,
            y : pinkyTile.y
        });

        this.addEventListenersToGhost(this.pinky);

        this.addSprite(this.pinky);

        const blinkyTile = this.map.house.getU().getR();
        this.blinky = makeGhost('blinky', {
            ...ghostAttrs,
            x : blinkyTile.x - this.map.tileWidth / 2,
            y : blinkyTile.y
        });

        this.addEventListenersToGhost(this.blinky);

        this.addSprite(this.blinky);

        const inkyTile = this.map.houseCenter.getL();
        this.inky = makeGhost('inky', {
            ...ghostAttrs,
            blinky : this.blinky,
            x : inkyTile.x - 16,
            y : inkyTile.y
        });

        this.addEventListenersToGhost(this.inky);

        this.addSprite(this.inky);

        const sueTile = this.map.houseCenter.getR().getR();
        this.sue = makeGhost('sue', {
            ...ghostAttrs,
            x : sueTile.x + 16,
            y : sueTile.y
        });

        this.addEventListenersToGhost(this.sue);

        this.addSprite(this.sue);

        show(this.elements.startReady);

        if (!this._win) {
            show(this.elements.startP1);

            this.hideGhosts();

            this.pacman.hide();

            this._start = 2;
        } else {
            this.bonus.hide();
            this._start = 1;
        }
    }

    addEventListenersToGhost(ghost) {
        ghost.on('item:eat', () => this.emit('game:ghost:eat', ghost));
        ghost.on('item:eaten', () => this.emit('game:ghost:eaten', ghost));
        ghost.on('item:modefrightened:enter', () => this.emit('game:ghost:modefrightened:enter'));
        ghost.on('item:modefrightened:exit', () => this.emit('game:ghost:modefrightened:exit'));
    }

    mainLoop() {
        // Global mode.
        this.model.updateMode();

        // Input
        this._inputDirection = this._getInputDirection();

        // Move.
        if (!this._pauseFrames) {
            if (this._start === 2) {
                hide(this.elements.startP1);
                this.showGhosts();
                this.pacman.show();

                this.model.lives = this.defaultLives;

                this._pauseFrames = 60;
                this._start--;
                return;
            }

            if (this._start === 1) {
                hide(this.elements.startReady);
                this._start--;
                return;
            }

            if (this._win) {
                this.startLevel();
                return;
            }

            if (this._gameOver) {
                hide(this.elements.gameOver);
                show(this.elements.splash);
                return;
            }

            if (this._showPacman) {
                this.pacman.show();
                this._showPacman = false;
            }

            this.pacman.move(this._inputDirection);

            if (this._pacmanEaten) {
                this.hideGhosts();
            } else {
                if (!this._soundBackPauseFrames) {
                    if (this._isGhostDead()) {
                        this.sound.play('dead');
                    }
                    else if (!this._isGhostFrightened()) {
                        this.sound.play('back');
                    }
                    this._soundBackPauseFrames = 5;
                } else this._soundBackPauseFrames--;

                this.pinky.move();
                this.blinky.move();
                this.inky.move();
                this.sue.move();

                if (this._destroyBonus) {
                    if (this._destroyBonus === 1) {
                        this.bonus.destroy();
                        delete this.bonus;
                    }
                    this._destroyBonus--;
                } else if (this.bonus) {
                    if (this._showBonus) {
                        if (this._showBonus === 1) {
                            this.bonus.show();
                        }
                        this._showBonus--;
                    } else {
                        this.bonus.move();
                    }
                }
            }

        } else {
            this._pauseFrames--;
        }
    }

    pause() {
        super.pause();

        this.pinky.pause();
        this.blinky.pause();
        this.inky.pause();
        this.sue.pause();

        this.muteSound(true);

        this.model.pause();

        this.elements.paused.style.display = '';
    }

    resume() {
        super.resume();

        this.pinky.resume();
        this.blinky.resume();
        this.inky.resume();
        this.sue.resume();

        this.muteSound(!!this._muted);

        this.model.resume();

        hide(this.elements.paused);
    }

    win() {
        this._pauseFrames = 120;
        this._win = true;

        let times = 14;
        this.addCallback(() => {
            if (times) {
                times--;
                this.el.classList.toggle('blink');
                return false; // Keep running.
            } else {
                this.el.classList.remove('blink');
                return true; // Remove callback.
            }
        }, this.refreshRate * 8);

        this.hideGhosts();
        this.map.hideItems();
        this.pacman.pauseAnimation();
    }

    hideGhosts() {
        this.pinky.hide();
        this.blinky.hide();
        this.inky.hide();
        this.sue.hide();

        if (this.bonus) this.bonus.hide();
    }

    showGhosts() {
        this.pinky.show();
        this.blinky.show();
        this.inky.show();
        this.sue.show();

        if (this.bonus && !this._showBonus) this.bonus.show();
    }

    _isGhostFrightened() {
        return this.blinky.isFrightened() ||
                this.inky.isFrightened()  ||
                this.pinky.isFrightened() ||
                this.sue.isFrightened();
    }

    _isGhostDead() {
        return this.blinky.isDead() ||
                this.inky.isDead()  ||
                this.pinky.isDead() ||
                this.sue.isDead();
    }

    _getInputDirection() {
        const keys = this.keyboard.keys;
        let direction = null;

        if (keys[KEY_UP]) {
            direction = 'u';
        }
        else if (keys[KEY_RIGHT]) {
            direction = 'r';
        }
        else if (keys[KEY_DOWN]) {
            direction = 'd';
        }
        else if (keys[KEY_LEFT]) {
            direction = 'l';
        }

        if (direction) {
            this._lastSwipe = null;
        }
        else if (this._lastSwipe === EVENT_SWIPE_UP) {
            direction = 'u';
        }
        else if (this._lastSwipe === EVENT_SWIPE_RIGHT) {
            direction = 'r';
        }
        else if (this._lastSwipe === EVENT_SWIPE_DOWN) {
            direction = 'd';
        }
        else if (this._lastSwipe === EVENT_SWIPE_LEFT) {
            direction = 'l';
        }

        return direction;
    }

    onLoadProgress(percent) {
        this.elements.load.querySelector('.inner').style.width = `${percent}%`;
    }

    _onSwipe(type, ev) {
        this._lastSwipe = type;
    }

    _onKeyDown(event) {
        // Sound on/off.
        if (event.keyCode === 83) {
            if (!this.soundEnabled) return;
            // Mute Sound.
            this._muted = !this._muted;
            this.muteSound(this._muted);

            var el = this.elements.soundStatus;

            if (this._muted) el.classList.remove('on');
            else el.classList.add('on');

            show(el);

            if (this._hideSoundStatusTimeout) clearTimeout(this._hideSoundStatusTimeout);
            this._hideSoundStatusTimeout = setTimeout(function() { hide(el); }, 2000);
        }
        // Pause Game.
        else if (event.keyCode === 80) {
            this._paused = !this._paused;
            if (this._paused) this.pause();
            else this.resume();
        }
    }

    _onChangeScore(model, score) {
        this.elements.score.innerText = score || '00';
    }

    _onChangeHighScore(model, highScore) {
        this.elements.highScore.innerText = highScore || '00';
    }
    // Cange lives. Check game over.
    _onChangeLives(model, lives) {
        if (lives === 0) {
            // Game over.
            this._gameOver = true;
            show(this.elements.gameOver);
            this.hideGhosts();
            this.pacman.hide();
            this.model.save();
        }
    }
    // Extra life.
    _onChangeExtraLives(model, lives) {
        this.sound.play('life');
    }
    // Change global mode.
    _onChangeMode(model, mode) {
        this.emit('game:globalmode', mode);
    }
    // Pacman eats ghost.
    _onGhostEaten(ghost) {
        this.pacman.hide();
        this._pauseFrames = 15;
        this._showPacman = true;
        this.model.addScore(parseInt(ghost.score));
        this.sound.play('eat');
    }
    // Ghost eats Pacman.
    _onGhostEat() {
        this._pauseFrames = 40;
        this._pacmanEaten = true;
    }

    template(model) {
        return `
            <div class="score">
                <div class="p1-score">1UP<br /><span>00</span></div>
                <div class="high-score">HIGH SCORE<br /><span>${model.highScore || '00'}</span></div>
                <div class="p2-score">2UP<br /><span>00</span></div>
            </div>
            <div class="start-p1" style="display: none">PLAYER ONE</div>
            <div class="start-ready" style="display: none">READY!</div>
            <div class="game-over" style="display: none">GAME OVER</div>
            <div class="sound-status on" style="display: none"><span class="wrap">SOUND: <span class="on">ON</span><span class="off">OFF</span></span></div>
            <div class="paused" style="display: none"><span class="wrap">PAUSED</span></div>
            <div class="splash">
                <span class="title">"JS PAC-MAN"</span>
                <p class="nerd">HTML - CSS<br><br><span>JAVASCRIPT</span></p>
                <a class="start" style="display: none">START</a>
                <div class="loadbar"><div class="inner"></div></div>
                <p class="keys"><span>&larr;&uarr;&darr;&rarr;</span>:MOVE <span>S</span>:SOUND <span>P</span>:PAUSE</p>
                <div class="credits">&#169; 2014-2020 <span>8</span>TENTACULOS <a href="https://github.com/8tentaculos/jsPacman">SOURCE+INFO</a></div>
            </div>
        `;
    }
}

Object.assign(JsPacman.prototype, defaults);

export default JsPacman;
