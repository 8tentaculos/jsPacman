import $ from 'jquery';
import './jquery.gamequery-0.7.1';
import { View } from 'rasti';
import Map from './Map';
import getLevelData from './Levels';
import makeMsPacman from './factory/makeMsPacman';
import makeGhost from './factory/makeGhost';
import makeDot from './factory/makeDot';
import makePill from './factory/makePill';
import makeBonus from './factory/makeBonus';
import Lives from './Lives';
import Bonuses from './Bonuses';
import Sound from './Sound';
import Scaling from './Scaling';
import ts from './helper/ts';

const show = el => { el.style.display = ''; }
const hide = el => { el.style.display = 'none'; }

class Game extends View {
    constructor(options) {
        super(options);

        const { w, h, window } = options;

        this.scaling = new Scaling(this.originalW, this.originalH);

        this.scaling.resize(w, h);

        this.el.style.fontSize = `${this.scaling.getScale() * 2}em`;

        show(this.el);

        this.render();

        this.$el = $(this.el);

        this.pg = this.$el.playground({
            width : this.scaling.w,
            height : this.scaling.h,
            keyTracker : true,
            disableCollision : true
        });

        window.document.addEventListener('keydown', ev => {
            // Sound on/off
            if (ev.keyCode === 83) {
                // Mute Sound.
                this._muted = !this._muted;
                this.sound.muted(this._muted);

                var el = this.elements.soundStatus;

                if (this._muted) el.classList.remove('on');
                else el.classList.add('on');

                show(el);

                if (this._hideSoundStatusTimeout) clearTimeout(this._hideSoundStatusTimeout);
                this._hideSoundStatusTimeout = setTimeout(function() { hide(el); }, 2000);
            }
            // Pause Game
            if (ev.keyCode === 80) {
                this._paused = !this._paused;
                if (this._paused) this.pause();
                else this.resume();
            }
        });

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

        // configure the loading bar
        $.loadCallback(percent => {
            this.elements.load.querySelector('.inner').style.width = `${percent}%`;
        });

        this.sound = new Sound(this.soundEnabled);

        this.lives = new Lives({
            lives : this.defaultLives + 1,
            x : 40,
            y : 1124,
            pg : this.pg,
            scaling : this.scaling
        });

        this.bonuses = new Bonuses({
            level : this.level,
            x : 860,
            y : 1124,
            pg : this.pg,
            scaling : this.scaling
        });

        this.lives.on('lives:gameover', () => {
            show(this.elements.gameOver);

            this._gameOver = true;

            this.hideGhosts();

            this.pacman.hide();

            if (window.localStorage) localStorage.jsPacmanHighScore = this.highScore;
        });

        if (window.localStorage && localStorage.jsPacmanHighScore) {
            this.highScore = localStorage.jsPacmanHighScore;
        }

        this._makeLevel();

        this.pg.startGame(() => {
            hide(this.elements.load);
            show(this.elements.start);
        });
    }

    start() {
        if (this._win) {
            this.level++;
            this.reset();
            this._win = false;
            return;
        }

        if (this._gameOver) {
            this.level = 1;
            this.reset();
            this._gameOver = false;
            hide(this.elements.splash);
            this.sound.play('intro');
            return;
        }

        hide(this.elements.splash);
        this.sound.play('intro');
        this.pg.registerCallback(this.mainLoop.bind(this), 30);
    }

    reset() {
        this.pinky.destroy();
        this.blinky.destroy();
        this.inky.destroy();
        this.sue.destroy();
        this.pacman.destroy();

        this.map.destroyItems();

        if (!this._win) {
            this.lives.set(this.defaultLives + 1);
            this.score = 0;
            this.extraLife = false;
        }

        $.gQ.keyTracker = {};

        this._inputDir = null;

        this._globalModeTime = null;

        this._lastGlobalMode = null;

        this._makeLevel();
    }

    _makeLevel() {
        Object.assign(this, getLevelData(this.level, 'game'));

        this.bonuses.setLevel(this.level);

        this.map = new Map(this.map);

        this.pg.removeClass('maze-1 maze-2 maze-3 maze-4');
        this.pg.addClass(this.maze);

        var dotColor = 'white';
        if (this.maze === 'maze-2') dotColor = 'yellow';
        if (this.maze === 'maze-3') dotColor = 'red';

        if (!this._win) show(this.elements.startP1);
        show(this.elements.startReady);

        this.addScore();

        this._pauseFrames = 80;

        this._destroyBonus = 0;
        this._showBonus = 500;

        var i = this.map.tiles.length, total = 0;
        while (i--) {
            var t = this.map.tiles[i];
            if (t.code === '.') {
                t.item = makeDot({
                    defaultAnimation : dotColor,
                    id : 'item-dot-' + i,
                    map : this.map,
                    pg : this.pg,
                    scaling : this.scaling,
                    x : t.x,
                    y : t.y
                });

                total++;
            }

            if (t.code === '*') {
                t.item = makePill({
                    defaultAnimation : dotColor,
                    id : 'item-pill-' + i,
                    map : this.map,
                    pg : this.pg,
                    scaling : this.scaling,
                    x : t.x,
                    y : t.y
                });
                total++;
            }
        }

        this.totalItems = total;
        // PACMAN
        this.pacman = makeMsPacman({
            ...getLevelData(this.level, 'pacman'),
            map : this.map,
            pg : this.pg,
            scaling : this.scaling
        });

        this.pacman.on('sprite:pill', (t) => {
            this._pauseFrames = 2;
            this.addScore(this.pillScore);
            if (!(--this.totalItems)) this._gameOver = true;
            this.sound.play('frightened');
        });
        // Pacman eats ghost
        this.pacman.on('sprite:eat', (ghost) => {
            ghost.pacman.hide();
            this._pauseFrames = 15;
            this._showPacman = true;
            this.addScore(parseInt(ghost.score));
            this.sound.play('eat');
        });
        // Ghost eats Pacman
        this.pacman.on('sprite:eaten', (ghost) => {
            this._pauseFrames = this.defaultPauseFrames;
            this._pacmanEaten = true;
        });
        // Pacman make die turn arround
        this.pacman.on('sprite:die', (ghost) => {
            this.sound.play('eaten');
        });
        // Pacman lose
        this.pacman.on('sprite:life', (ev) => {
            $.gQ.keyTracker = {};

            this._inputDir = null;

            this._globalModeTime = null;

            this._lastGlobalMode = null;

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

            this.lives.die();

            this._pacmanEaten = false;

            if (this.lives.lives) {
                show(this.elements.startReady);
                this._start = 1;
            }

            if (this.lives.lives) this._pauseFrames = this.defaultPauseFrames;
            else this._pauseFrames = 120;
        });
        // Pacman eats dot
        this.pacman.on('sprite:dot', (t) => {
            this.addScore(this.dotScore);

            this.sound.play('dot');
            // Win!!!
            if (!(--this.totalItems)) {
                this._pauseFrames = 120;

                this._win = true;

                this.hideGhosts();
                this.map.hideItems();
                this.pacman.$el.pauseAnimation();
            }

        });
        // Pacman eats bonus
        this.pacman.on('sprite:bonus', (bonus) => {
            if (this._showBonus) return; // Not yet in the maze
            this._pauseFrames = 5;
            this._destroyBonus = 25;
            this.addScore(parseInt(bonus.score));
            this.sound.play('bonus');
        });

        // BONUS
        if (this.bonus) {
            this.bonus.destroy();
        }

        var bonusT = this.map.tunnels[this.map.tunnels.length - 1];
        this.bonus = makeBonus({
            id : this.bonusId,
            map : this.map,
            pg : this.pg,
            scaling : this.scaling,
            dir : 'l',
            pacman : this.pacman,
            score : this.bonusScore,
            x : bonusT.x,
            y : bonusT.y
        });

        // Bonus reaches target and disappears
        this.bonus.on('sprite:bonusdestroy', (bonus) => {
            this.bonus.destroy();
            delete this.bonus;
        });

        // GHOSTS
        var ghostAttrs = {
            ...getLevelData(this.level, 'ghost'),
            map : this.map,
            pg : this.pg,
            scaling : this.scaling,
            pacman : this.pacman,
            addGameGlobalModeEventListener : listener => this.on('game:globalmode', listener)
        };

        var pinkyT = this.map.houseCenter.getR();
        this.pinky = makeGhost({
            ...ghostAttrs,
            id : 'bot-pinky',
            x : pinkyT.x - this.map.tw / 2,
            y : pinkyT.y
        });

        var blinkyT = this.map.house.getU().getR();
        this.blinky = makeGhost({
            ...ghostAttrs,
            id : 'bot-blinky',
            x : blinkyT.x - this.map.tw / 2,
            y : blinkyT.y
        });

        var inkyT = this.map.houseCenter.getL();
        this.inky = makeGhost({
            ...ghostAttrs,
            blinky : this.blinky,
            id : 'bot-inky',
            x : inkyT.x - 16,
            y : inkyT.y
        });

        var sueT = this.map.houseCenter.getR().getR();
        this.sue = makeGhost({
            ...ghostAttrs,
            id : 'bot-sue',
            x : sueT.x + 16,
            y : sueT.y
        });

        if (!this._win) {
            this.hideGhosts();

            this.pacman.hide();

            this._start = 2;
        } else {
            this.bonus.hide();
            this._start = 1;
        }
    }

    addScore(score) {
        this.score = this.score + (score || 0);
        this.elements.score.innerText = this.score || '00';

        if (!this.extraLife && this.score >= this.extraLifeScore) {
            this.extraLife = true;
            this.lives.add();
            this.sound.play('life');
        }

        if (this.highScore < this.score) {
            this.highScore = this.score;
            this._addedHighscore= false;
        }

        if (!this._addedHighscore) {
            this._addedHighscore = true;
            this.elements.highScore.innerText = this.highScore || '00';
        }
    }

    mainLoop() {
        if (this._win) {
            if (!this._mazeBlinkPauseFrames) {
                if (this.pg.hasClass('blink')) {
                    this.pg.removeClass('blink');
                } else this.pg.addClass('blink');

                this._mazeBlinkPauseFrames = 8;
            } else this._mazeBlinkPauseFrames--;
        }
        // Global mode.
        var globalMode = this._getGlobalMode();
        if (this._lastGlobalMode !== globalMode) {
            this.emit('game:globalmode', globalMode);
            this._lastGlobalMode = globalMode;
        }

        if (!this._start) {
            if (!this._isGhostFrightened()) {
                this.sound.sounds.frightened.stop();
            } else if (this._isGhostDead()) {
                this.sound.sounds.frightened.audio.volume = 0;
            } else {
                this.sound.sounds.frightened.audio.volume = 1;
            }
        }

        // Input
        this._inputDir = this.stickyTurn ? this._getInputDir() || this._inputDir : this._getInputDir();

        // Move.
        if (!this._pauseFrames) {
            if (this._start === 2) {
                hide(this.elements.startP1);

                this.showGhosts();

                this.lives.set(this.defaultLives);

                this.pacman.show();

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
                this.pg.removeClass('blink');

                this.start();

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

            if (!this._pauseFramesPacman) {
                this.pacman.move(this._inputDir);
            } else this._pauseFramesPacman--;

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
        this._pauseTime = ts();

        this.pinky.pause();
        this.blinky.pause();
        this.inky.pause();
        this.sue.pause();

        this.sound.muted(true);

        this.pg.pauseGame();

        this.elements.paused.style.display = '';
    }

    resume() {
        this._globalModeTime = ts() - this._pauseTime;

        this.pinky.resume();
        this.blinky.resume();
        this.inky.resume();
        this.sue.resume();

        this.sound.muted(this._muted);

        this.pg.resumeGame();

        hide(this.elements.paused);
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

    _getGlobalMode() {
        var times = getLevelData(1, 'times');

        if (!this._globalModeTime) {
            this._globalModeTime = ts();
            return times[0].mode;
        }
        else {
            var now = ts(), idx, total = 0;
            var i = 0;
            while (times[i]) {
                total += times[i].time;
                if (total + this._globalModeTime > now) return times[i].mode;
                i++;
            }
            return times[times.length - 1].mode;
        }
    }

    _getInputDir() {
        var keys = $.gQ.keyTracker;

        if (keys[38]) {
            return 'u';
        }

        if (keys[39]) {
            return 'r';
        }

        if (keys[40]) {
            return 'd';
        }

        if (keys[37]) {
            return 'l';
        }

        return null;
    }

    template() {
        return `
            <div class="score">
                <div class="p1-score">1UP<br /><span></span></div>
                <div class="high-score">HIGH SCORE<br /><span></span></div>
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
            </div>
        `;
    }
}

Object.assign(Game.prototype, {
    // Options.
    originalW : 896,
    originalH : 1152,

    dotScore : 10,
    pillScore : 50,

    defaultPauseFrames : 40,

    defaultLives :  3,

    // Remember last input direction when arriving to intersection.
    stickyTurn : false,

    soundEnabled : true,

    DEBUG : true,

    // Playground.
    pg : null,

    score : 0,
    highScore : 0,

    extraLifeScore : 10000,
    extraLife : false,

    level : 1,

    events : {
        'click .start' : 'start'
    }
});

export default Game;
