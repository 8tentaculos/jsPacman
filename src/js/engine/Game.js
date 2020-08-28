import { View } from 'rasti';

import KeyTracker from './KeyTracker';
import Scaling from './Scaling';

// Those are the possible states of the engine
export const STATE_NEW = 0; // Not yet started for the first time
export const STATE_RUNNING = 1; // Started and running
export const STATE_PAUSED = 2; // Paused

const defaults = {
    height : 320,
    width : 480,
    originalHeight : 320,
    originalWidth : 480,
    refreshRate : 30,
    position : 'absolute'
};

class Game extends View {
    constructor(options) {
        super(options);

        Object.keys(defaults).forEach((key) => {
            if (key in options) this[key] = options[key];
        });

        this.sprites = this.children; // List of sprites with animations / images used in the game
        this.sounds = []; // List of sounds used in the game
        this.callbacks = []; // List of the functions called at each refresh
        this.loadedSpritesIndex = 0; // Keep track of the last loaded animation
        this.loadedSoundsIndex = 0; // Keep track of the last loaded sound

        this.keyTracker = new KeyTracker({ el : document });

        this.scaling = new Scaling(this.originalWidth, this.originalHeight);
        this.scaling.resize(this.width, this.height);

        this.state = STATE_NEW;
    }

    render() {
        super.render();

        // We initialize the display of the div
        Object.assign(this.el.style, {
            position : this.position,
            display : 'block',
            overflow : 'hidden',
            height : `${this.scaling.height}px`,
            width : `${this.scaling.width}px`,
            fontSize : `${this.scaling.getFactor() * 2}em`
        });

        this.scenegraph = this.createElement('div', {
            style : 'visibility: hidden;' 
        });

        this.el.appendChild(this.scenegraph);

        return this;
    }

    /**
     * Load resources before starting the game.
     */
    preload() {
        // Start loading the images
        for (let i = this.sprites.length - 1; i >= this.loadedSpritesIndex; i--) {
            this.sprites[i].load();
        }

        // Start loading the sounds
        for (let i = this.sounds.length - 1 ; i >= this.loadedSoundsIndex; i--){
            this.sounds[i].load();
        }

        this.waitForResources();
    }

    /**
     * Wait for all the resources called for in preload() to finish loading.
     */
    waitForResources() {
        // Check the images
        let spriteCount = 0;
        for (let i = this.loadedSpritesIndex; i < this.sprites.length; i++) {
            if (this.sprites[i].isReady()) {
                spriteCount++;
            }
        }
        // Check the sounds
        let soundCount = 0;
        for (let i = this.loadedSoundsIndex; i < this.sounds.length; i++) {
            if (this.sounds[i].isReady()) {
                soundCount++;
            }
        }
        // Call the load callback with the current progress
        if (typeof this.onLoadProgress === 'function') {
            let percent = (spriteCount + soundCount) / (this.sprites.length + this.sounds.length - this.loadedSpritesIndex - this.loadedSoundsIndex) * 100;
            this.onLoadProgress(percent);
        }

        if (spriteCount + soundCount < (this.sprites.length + this.sounds.length - this.loadedSpritesIndex - this.loadedSoundsIndex)) {
            setTimeout(this.waitForResources.bind(this), 100);
        } else {
            this.loadedSpritesIndex = this.sprites.length;
            this.loadedSoundsIndex = this.sounds.length;

            // Launch the refresh loop
            if (this.state === STATE_NEW){
                setInterval(this.refresh.bind(this), this.refreshRate);
            }

            this.state = STATE_RUNNING;

            if (typeof this.onStart === 'function'){
                this.onStart();
            }
            // Make the scenegraph visible
            this.scenegraph.style.visibility = 'visible';
        }
    }
    /**
     * Add a sprite to the current node. Works only on the playground or any of its sub-nodes
     *
     * This is a non-destructive call
     */
    addSprite(sprite, callback) {
        this.scenegraph.appendChild(this.addChild(sprite).el);

        return this.state === STATE_RUNNING ?
            sprite.load(callback).then(() => {
                this.loadedSpritesIndex++;
                return Promise.resolve();
            }) :
            Promise.resolve();
    }
    /**
     * Add a sound to the resource Manager
     */
    addSound(sound, callback) {
        this.sounds.push(sound);
        return this.state === STATE_RUNNING ?
            sound.load(callback).then(() => {
                this.loadedSoundsIndex++;
                return Promise.resolve();
            }) :
            Promise.resolve();
    }
    /**
     * Register a callback
     *
     * @param {function} fn the callback
     * @param {integer} rate the rate in ms at which the callback should be called (should be a multiple of the playground rate or will be rounded)
     */
    addCallback(callback, rate) {
        this.callbacks.push({ fn : callback, rate : Math.round(rate / this.refreshRate) || rate, idleCounter : 0 });
    }
    /**
     * Called periodically to refresh the state of the game.
     */
    refresh() {
        if (this.state === STATE_RUNNING) {
            this.sprites.forEach(sprite => { sprite.refresh() });

            var deadCallback = [];
            for (var i = this.callbacks.length - 1; i >= 0; i--){
                if(this.callbacks[i].idleCounter === this.callbacks[i].rate - 1) {
                    const value = this.callbacks[i].fn();
                    if (typeof value === 'boolean'){
                        // If we have a boolean: 'true' means 'no more execution', 'false' means 'keep on executing'
                        if (value){
                            deadCallback.push(i);
                        }
                    } else if (typeof value === 'number') {
                        // If we have a number it re-defines the time to the next call
                        this.callbacks[i].rate = Math.round(value / this.refreshRate);
                        this.callbacks[i].idleCounter = 0;
                    }
                }
                this.callbacks[i].idleCounter = (this.callbacks[i].idleCounter + 1) % this.callbacks[i].rate;
            }

            for (var i = deadCallback.length - 1; i >= 0; i--){
                this.callbacks.splice(deadCallback[i], 1);
            }
        }
    }
    /**
     * Clear the animations and sounds
     */
    clear(clearCallbacks){
        this.destroyChildren();
        this.loadedSpritesIndex = 0;
        this.sounds = [];
        this.loadedSoundsIndex = 0;
        if (clearCallbacks) {
            this.callbacks = [];
        }
        this.scenegraph.innerHTML = '';
    }
    /**
    * Mute (or unmute) all the sounds.
    */
    muteSound(muted){
        for (var i = this.sounds.length - 1 ; i >= 0; i --) {
            this.sounds[i].mute(muted);
        }
    }
    /**
    * Starts the game.
    *
    * Resources from the resource manager are preloaded if necesary
    * Works only for the playground node.
    *
    * This is a non-destructive call
    */
    startGame(callback) {
        if (typeof callback === 'function') this.onStart = callback;
        this.preload();
    }
    /**
     * TODO
     */
    pauseGame() {
        this.state = STATE_PAUSED;
        this.scenegraph.style.visibility = 'hidden';
    }
    /**
     * Resume the game if it was paused and call the callback passed in argument once the newly added ressources are loaded.
     */
    resumeGame(callback) {
        if (this.state === STATE_PAUSED){
            if (typeof callback === 'function') this.onStart = callback;
            this.preload();
        }
    }

    normalizeRefrashRate(rate) {
        return Math.round(rate / this.refreshRate) || 1;
    }
}

Object.assign(Game.prototype, defaults);

export default Game;
