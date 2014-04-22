define([
'jquery', 
'Helper',
'Map', 
'maps/map1', 
'FactoryMsPacman',
'FactoryGhost', 
'FactoryDot', 
'FactoryPill',
'Lives',
'SoundWrapper',
'gameQuery'
], function($, Helper, Map, map1, FactoryMsPacman, FactoryGhost, FactoryDot, FactoryPill, Lives, SoundWrapper) {

    var _times = [
        [{mode : 'scatter', time : 7}, {mode : 'chase', time : 20}, {mode : 'scatter', time : 7}, {mode : 'chase', time : 20}, {mode : 'scatter', time : 5}, {mode : 'chase', time : 20}, {mode : 'scatter', time : 5}, {mode : 'chase', time : 1000000}]
    ];

    var Game = function(el) {
        this.el = $(el);

        this.pg = this.el.playground({width : this.w, height : this.h, keyTracker : true});

        $(document).keydown($.proxy(function(ev) {
            if (ev.which === 83) {
               // Mute Sound.
                this._muted = !this._muted;
                $.muteSound(this._muted);

                var el = this.$$.soundStatus;

                if (this._muted) el.removeClass('on');
                else el.addClass('on');

                el.show();

                if (this._hideSoundStatusTimeout) clearTimeout(this._hideSoundStatusTimeout);
                this._hideSoundStatusTimeout = setTimeout(function() { el.hide(); }, 2000);
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
            fps : $('#fps')
        };
        // sets the div to use to display the game and its dimension
        

        // configure the loading bar
        //$.loadCallback(function(percent){
        //   $('#loadBar').width(400*percent);
        //   $('#loadtext').html(''+percent+'%')
        //});

        // register the start button and remove the splash screen once the game is ready to starts
        this.$$.start.click($.proxy(function() {
            this.start();
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

        DEBUG : true,
        
        // End Options.
        pg : null,
        
        score : 0,
        highScore : 0,

        
        start : function() {

            if (this._gameOver) {
                this._gameOver = false;
                this.reset();
                this.$$.splash.hide();
                this.sounds.intro.play();
                return;
            }

            this.pg.startGame($.proxy(function() {
                // Use dual mode (2 same audios alternate) on IE
                var dual = window.ActiveXObject || "ActiveXObject" in window;

                this.sounds = {
                    intro : new $.gQ.SoundWrapper('audio/intro.mp3'),
                    back : new $.gQ.SoundWrapper('audio/back.mp3', false, dual),
                    dot : new $.gQ.SoundWrapper('audio/dot.mp3'),
                    eaten : new $.gQ.SoundWrapper('audio/eaten.mp3')
                };

                this.addScore();

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
                }, this));

                this.map = new Map(map1);

                this._makeLevel();

                this.$$.splash.hide();
                this.sounds.intro.play();
            }, this));
            
            this.pg.registerCallback($.proxy(this.mainLoop, this), 40);
        },

        reset : function() {
            this.pinky.destroy();
            this.blinky.destroy();
            this.inky.destroy();
            this.sue.destroy();
            this.pacman.destroy();

            this.lives.set(this.defaultLives);
            this.score = 0;

            $.gQ.keyTracker = {};

            this._inputDir = null;

            this._globalModeTime = null;

            this._lastGlobalMode = null;
            
            this._makeLevel();
        },

        _makeLevel : function() {
            this.$$.startP1.show();
            this.$$.startReady.show();

            this.addScore();
            
            this._pauseFrames = 80;

            var i = this.map.tiles.length, total = 0;
            while (i--) {
                var t = this.map.tiles[i];
                if (t.item) t.item.destroy();
                if (t.code === '.') {
                    t.item = FactoryDot.make({
                        id : 'item-dot-' + i,
                        map : this.map,
                        pg : this.pg,
                        x : t.x,
                        y : t.y
                    });

                    // t.item.el.addSound(
                    //     new $.gQ.SoundWrapper('audio/dot.mp3')
                    // );

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
        
            this.pacman = FactoryMsPacman.make({
                map : this.map,
                pg : this.pg
            });

            this.pacman.on('sprite:pill', $.proxy(function(ev, t) {
                this._pauseFrames = 2;
                this.addScore(this.pillScore);
                if (!(--this.totalItems)) this._gameOver = true;
            }, this));

            this.pacman.on('sprite:eat', $.proxy(function(ev, ghost) {
                ghost.pacman.el.hide();
                this._pauseFrames = 8;
                this._showPacman = true;
                this.addScore(parseInt(ghost.score));
            }, this));

            this.pacman.on('sprite:eaten', $.proxy(function(ev, ghost) {
                this._pauseFrames = this.defaultPauseFrames;
                this._pacmanEaten = true;
            }, this));

            this.pacman.on('sprite:die', $.proxy(function(ev, ghost) {
                this.sounds.eaten.play();
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

                this.sounds.dot.play();

                if (!(--this.totalItems)) {
                    this._pauseFrames = 120;
                    this._gameOver = true;
                    this.hideGhosts();
                    
                    this.pacman.el.pauseAnimation();
                }
            }, this));

            this.pinky = FactoryGhost.make({
                map : this.map,
                pg : this.pg,
                pacman : this.pacman,
                id : 'bot-pinky'
            });

            this.blinky = FactoryGhost.make({
                map : this.map,
                pg : this.pg,
                pacman : this.pacman,
                id : 'bot-blinky'
            });

            this.inky = FactoryGhost.make({
                map : this.map,
                pg : this.pg,
                pacman : this.pacman,
                id : 'bot-inky'
            });

            this.sue = FactoryGhost.make({
                map : this.map,
                pg : this.pg,
                pacman : this.pacman,
                id : 'bot-sue'
            });

            this.hideGhosts();

            this.pacman.el.hide();

            this._start = 2;
        },
        
        addScore : function(score) {
            this.score = this.score + (score || 0);
            this.$$.score.text(this.score || '00');
            if (!this._addedHighscore || this.highScore < this.score) {
                this._addedHighscore = true;
                this.highScore = this.score;
                this.$$.highScore.text(this.score || '00');
            }
        },
        
        mainLoop : function() {
            // if (this._lastTime) {
            //     this.$$.fps.text(parseInt(1000 / ((new Date().getTime()) - this._lastTime)) + 'fps');
            // } this._lastTime = (new Date().getTime());

            // Global mode.
            var globalMode = this._getGlobalMode();
            if (this._lastGlobalMode !== globalMode) {
                this.trigger('game:globalmode', globalMode);
                this._lastGlobalMode = globalMode;
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
                        this.sounds.back.play();
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