define([
'jquery', 
'Helper',
'Levels',
'Map', 
'Factory/MsPacman',
'Factory/Ghost', 
'Factory/Dot', 
'Factory/Pill',
'Lives',
'Sound',
'gameQuery'
], function($, Helper, Levels, Map, FactoryMsPacman, FactoryGhost, FactoryDot, FactoryPill, Lives, Sound) {

    var _times = [
        [{mode : 'scatter', time : 7}, {mode : 'chase', time : 20}, {mode : 'scatter', time : 7}, {mode : 'chase', time : 20}, {mode : 'scatter', time : 5}, {mode : 'chase', time : 20}, {mode : 'scatter', time : 5}, {mode : 'chase', time : 1000000}]
    ];

    var Game = function(el) {

        this.el = $(el);

        this.pg = this.el.playground({width : this.w, height : this.h, keyTracker : true});

        $(document).keydown($.proxy(function(ev) {
            // Sound on/off
            if (ev.which === 83) {
                // Mute Sound.
                this._muted = !this._muted;
                Sound.muted(this._muted);

                var el = this.$$.soundStatus;

                if (this._muted) el.removeClass('on');
                else el.addClass('on');

                el.show();

                if (this._hideSoundStatusTimeout) clearTimeout(this._hideSoundStatusTimeout);
                this._hideSoundStatusTimeout = setTimeout(function() { el.hide(); }, 2000);
            }
            // Pause Game
            if (ev.which === 80) {
                this._paused = !this._paused;
                if (this._paused) this.pause();
                else this.resume();
            }

        }, this));

        this.$$ = {
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
        $.loadCallback($.proxy(function(percent){
            $('.inner', this.$$.load).width(percent + '%');
        }, this));

        // register the start button and remove the splash screen once the game is ready to starts
        this.$$.start.click($.proxy(function() {
            this.start();
        }, this));

        Sound.init(this.sound);

        this.lives = new Lives({
            lives : this.defaultLives,
            x : 20,
            y : 562,
            pg : this.pg
        });

        this.lives.on('lives:gameover', $.proxy(function() { 
            this.$$.gameOver.show();

            this._gameOver = true;

            this.hideGhosts();

            this.pacman.el.hide();

            if (window.localStorage) localStorage.jsPacmanHighScore = this.highScore;
        }, this));

        if (window.localStorage && localStorage.jsPacmanHighScore) {
            this.highScore = localStorage.jsPacmanHighScore;
        }

        this._makeLevel();
        
        this.pg.startGame($.proxy(function() {
            this.$$.load.hide();
            this.$$.start.show();
        }, this));
        
    };

    $.extend(Game.prototype, Helper, {
        // Options.
        w : 448,
        h : 576,
        
        dotScore : 10,
        pillScore : 50,

        defaultPauseFrames : 40,

        defaultLives :  3,

        stickyTurn : false, // Remember last input direction when arriving to intersection.

        sound : true,

        DEBUG : true,
        
        // End Options.
        pg : null,
        
        score : 0,
        highScore : 0,

        level : 1,

        start : function() {
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
                this.$$.splash.hide();
                Sound.play('intro');
                return;
            }

            this.$$.splash.hide();
            Sound.play('intro');
            this.pg.registerCallback($.proxy(this.mainLoop, this), 40);
        },

        reset : function() {
            this.pinky.destroy();
            this.blinky.destroy();
            this.inky.destroy();
            this.sue.destroy();
            this.pacman.destroy();

            this.map.destroy();

            if (!this._win) {
                this.lives.set(this.defaultLives);
                this.score = 0;
            }

            $.gQ.keyTracker = {};

            this._inputDir = null;

            this._globalModeTime = null;

            this._lastGlobalMode = null;

            this._makeLevel();
        },

        _makeLevel : function() {
            $.extend(this, Levels.get(this.level, 'game'));

            this.map = new Map(this.map);

            this.pg.removeClass('maze-1 maze-2 maze-3 maze-4');
            this.pg.addClass(this.maze);

            if (!this._win) this.$$.startP1.show();
            this.$$.startReady.show();

            this.addScore();
            
            this._pauseFrames = 80;

            var i = this.map.tiles.length, total = 0;
            while (i--) {
                var t = this.map.tiles[i];
                if (t.code === '.') {
                    t.item = FactoryDot.make({
                        id : 'item-dot-' + i,
                        map : this.map,
                        pg : this.pg,
                        x : t.x,
                        y : t.y
                    });

                    total++;
                }

                if (t.code === '*') {
                    t.item = FactoryPill.make({
                        id : 'item-pill-' + i,
                        map : this.map,
                        pg : this.pg,
                        x : t.x,
                        y : t.y
                    });
                    total++;
                }
            }

            this.totalItems = total;
        
            this.pacman = FactoryMsPacman.make($.extend(Levels.get(this.level, 'pacman'), {
                map : this.map,
                pg : this.pg
            }));

            this.pacman.on('sprite:pill', $.proxy(function(ev, t) {
                this._pauseFrames = 2;
                this.addScore(this.pillScore);
                if (!(--this.totalItems)) this._gameOver = true;
                Sound.play('frightened');
            }, this));
            // Pacman eats ghost
            this.pacman.on('sprite:eat', $.proxy(function(ev, ghost) {
                ghost.pacman.el.hide();
                this._pauseFrames = 15;
                this._showPacman = true;
                this.addScore(parseInt(ghost.score));
                Sound.play('eat');
            }, this));
            // Ghost eats Pacman
            this.pacman.on('sprite:eaten', $.proxy(function(ev, ghost) {
                this._pauseFrames = this.defaultPauseFrames;
                this._pacmanEaten = true;
            }, this));

            this.pacman.on('sprite:die', $.proxy(function(ev, ghost) {
                Sound.play('eaten');
            }, this));

            this.pacman.on('sprite:life', $.proxy(function(ev) {
                $.gQ.keyTracker = {};

                this._inputDir = null;

                this._globalModeTime = null;

                this._lastGlobalMode = null;
                
                this.pacman.reset();

                this.pinky.reset();
                this.blinky.reset();
                this.inky.reset();
                this.sue.reset();

                this.showGhosts();

                this.lives.die();

                this._pacmanEaten = false;

                if (this.lives.lives) {
                    this.$$.startReady.show();
                    this._start = 1;
                }

                if (this.lives.lives) this._pauseFrames = this.defaultPauseFrames;
                else this._pauseFrames = 120;
            }, this));

            this.pacman.on('sprite:dot', $.proxy(function(ev, t) {
                this.addScore(this.dotScore);

                Sound.play('dot');
                // Win!!!
                if (!(--this.totalItems)) {
                    this._pauseFrames = 120;

                    this._win = true;

                    this.hideGhosts();
                    
                    this.pacman.el.pauseAnimation();
                }
            }, this));

            var ghostAttrs = $.extend(Levels.get(this.level, 'ghost'), {
                map : this.map,
                pg : this.pg,
                pacman : this.pacman
            });

            var pinkyT = this.map.houseCenter.getR();
            this.pinky = FactoryGhost.make($.extend(ghostAttrs, {
                id : 'bot-pinky',
                x : pinkyT.x - this.map.tw / 2,
                y : pinkyT.y
            }));

            var blinkyT = this.map.house.getU().getR();
            this.blinky = FactoryGhost.make($.extend(ghostAttrs, {
                id : 'bot-blinky',
                x : blinkyT.x - this.map.tw / 2,
                y : blinkyT.y
            }));

            var inkyT = this.map.houseCenter.getL();
            this.inky = FactoryGhost.make($.extend(ghostAttrs, {
                blinky : this.blinky,
                id : 'bot-inky',
                x : inkyT.x - 8,
                y : inkyT.y
            }));

            var sueT = this.map.houseCenter.getR().getR();
            this.sue = FactoryGhost.make($.extend(ghostAttrs, {
                id : 'bot-sue',
                x : sueT.x + 8,
                y : sueT.y
            }));

            if (!this._win) { 
                this.hideGhosts();

                this.pacman.el.hide();

                this._start = 2;
            } else {
                this._start = 1;
            }
        },
        
        addScore : function(score) {
            this.score = this.score + (score || 0);
            this.$$.score.text(this.score || '00');
            if (this.highScore < this.score) {
                this.highScore = this.score;
                this._addedHighscore= false;
            }

            if (!this._addedHighscore) {
                this._addedHighscore = true;
                this.$$.highScore.text(this.highScore || '00');
            }
        },
        
        mainLoop : function() {
            // Global mode.
            var globalMode = this._getGlobalMode();
            if (this._lastGlobalMode !== globalMode) {
                this.trigger('game:globalmode', globalMode);
                this._lastGlobalMode = globalMode;
            }

            if (!this._start) {
                if (!this._isGhostFrightened()) {
                    Sound.sounds.frightened.stop();
                } else if (this._isGhostDead()) {
                    Sound.sounds.frightened.audio.volume = 0;
                } else {
                    Sound.sounds.frightened.audio.volume = 1;
                }
            }

            // Input
            this._inputDir = this.stickyTurn ? this._getInputDir() || this._inputDir : this._getInputDir();
            
            // Move.
            if (!this._pauseFrames) {
                if (this._start === 2) {
                    this.$$.startP1.hide();
                    
                    this.showGhosts();
                    
                    this.pacman.el.show();
                    
                    this._pauseFrames = 60;
                    this._start--;

                    return;
                }

                if (this._start === 1) {
                    this.$$.startReady.hide();
                    this._start--;

                    return;
                }

                if (this._win) {
                    this.start();

                    return;
                }

                if (this._gameOver) {
                    this.$$.gameOver.hide();
                    this.$$.splash.show();
                    
                    return;
                }

                if (this._showPacman) {
                    this.pacman.el.show();
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
                            Sound.play('dead');
                        }
                        else if (!this._isGhostFrightened()) {
                            Sound.play('back');
                        }
                        this._soundBackPauseFrames = 5;
                    } else this._soundBackPauseFrames--;

                    this.pinky.move();
                    this.blinky.move();
                    this.inky.move();
                    this.sue.move();
                }

            } else {
                this._pauseFrames--;
            }
        },

        pause : function() {
            this._pauseTime = this.ts();

            this.pinky.pause();
            this.blinky.pause();
            this.inky.pause();
            this.sue.pause();

            Sound.muted(true);

            this.pg.pauseGame();

            this.$$.paused.show();
        },

        resume : function() {
            this._globalModeTime = this.ts() - this._pauseTime;

            this.pinky.resume();
            this.blinky.resume();
            this.inky.resume();
            this.sue.resume();

            Sound.muted(this._muted);

            this.pg.resumeGame();

            this.$$.paused.hide();
        },

        hideGhosts : function() {
            this.pinky.el.hide();
            this.blinky.el.hide();
            this.inky.el.hide();
            this.sue.el.hide();
        },

        showGhosts : function() {
            this.pinky.el.show();
            this.blinky.el.show();
            this.inky.el.show();
            this.sue.el.show();
        },

        _isGhostFrightened : function() {
            return this.blinky.isFrightened() ||
                    this.inky.isFrightened()  ||
                    this.pinky.isFrightened() ||
                    this.sue.isFrightened();
        },

        _isGhostDead : function() {
            return this.blinky.isDead() ||
                    this.inky.isDead()  ||
                    this.pinky.isDead() ||
                    this.sue.isDead();
        },

        _getGlobalMode : function() {
            var times = _times[0]; // Level 1.

            if (!this._globalModeTime) {
                this._globalModeTime = this.ts();
                return times[0].mode;
            }
            else {
                var now = this.ts(), idx, total = 0;
                var i = 0;
                while (times[i]) {
                    total += times[i].time;
                    if (total + this._globalModeTime > now) return times[i].mode;
                    i++;
                }
                return times[times.length - 1].mode;
            }
        },
        
        _getInputDir : function() {
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
    });

    return Game;

});