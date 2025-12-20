import { View } from 'rasti';

import Keyboard from './Keyboard.js';
import Touch from './Touch.js';
import Gamepad from './Gamepad.js';
import Scaling from './Scaling.js';

/**
 * Game state: New game, not yet started.
 * @constant {number}
 */
export const STATE_NEW = 0;
/**
 * Game state: Game is currently running.
 * @constant {number}
 */
export const STATE_RUNNING = 1;
/**
 * Game state: Game is paused.
 * @constant {number}
 */
export const STATE_PAUSED = 2;

/**
 * Default properties for Game instances.
 * @type {Object}
 */
const defaults = {
    height : 320,
    width : 480,
    originalHeight : 320,
    originalWidth : 480,
    refreshRate : 30,
    position : 'absolute'
};

/**
 * Main Game engine class that manages sprites, sounds, callbacks, and game loop.
 * Extends View from rasti framework.
 * @class Game
 * @extends {View}
 */
class Game extends View {
    /**
     * Creates an instance of Game.
     * @param {Object} options - Configuration options for the game.
     * @param {number} [options.height=320] - Height of the game canvas in pixels.
     * @param {number} [options.width=480] - Width of the game canvas in pixels.
     * @param {number} [options.originalHeight=320] - Original height for scaling calculations.
     * @param {number} [options.originalWidth=480] - Original width for scaling calculations.
     * @param {number} [options.refreshRate=30] - Game loop refresh rate in milliseconds.
     * @param {string} [options.position='absolute'] - CSS position property for the game container.
     */
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

        this.keyboard = new Keyboard();
        this.touch = new Touch();
        this.gamepad = new Gamepad();

        this.scaling = new Scaling(this.originalWidth, this.originalHeight);
        this.scaling.resize(this.width, this.height);

        this.state = STATE_NEW;
    }

    /**
     * Renders the game container and sets up the scenegraph.
     * @returns {Game} Returns this instance for method chaining.
     */
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
     * Cleanup method called when the game is destroyed.
     * Removes keyboard, touch, and gamepad event listeners.
     */
    onDestroy() {
        this.keyboard.destroy();
        this.touch.destroy();
        this.gamepad.destroy();
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

        const rest = this.sprites.length + this.sounds.length - this.loadedSpritesIndex - this.loadedSoundsIndex;

        // Call the load callback with the current progress
        if (typeof this.onLoadProgress === 'function') {
            let percent = (spriteCount + soundCount) / rest * 100;
            this.onLoadProgress(percent);
        }

        if (spriteCount + soundCount < rest) {
            setTimeout(this.waitForResources.bind(this), 100);
        } else {
            this.loadedSpritesIndex = this.sprites.length;
            this.loadedSoundsIndex = this.sounds.length;

            // Launch the refresh loop
            if (this.state === STATE_NEW){
                setInterval(this.refresh.bind(this), this.refreshRate);
            }

            this.state = STATE_RUNNING;

            if (typeof this._onReadyCallback === 'function'){
                this._onReadyCallback();
                this._onReadyCallback = null;
            }
            // Make the scenegraph visible
            this.scenegraph.style.visibility = 'visible';
        }
    }
    /**
     * Adds a sprite to the game scenegraph.
     * @param {Sprite} sprite - The sprite instance to add.
     * @returns {Promise} Promise that resolves when the sprite is loaded (if game is running).
     */
    addSprite(sprite) {
        this.scenegraph.appendChild(this.addChild(sprite).el);

        return this.state === STATE_RUNNING ?
            sprite.load().then(() => {
                this.loadedSpritesIndex++;
                return Promise.resolve();
            }) :
            Promise.resolve();
    }
    /**
     * Adds a sound to the game's sound collection.
     * @param {Sound} sound - The sound instance to add.
     * @returns {Promise} Promise that resolves when the sound is loaded (if game is running).
     */
    addSound(sound) {
        this.sounds.push(sound);
        return this.state === STATE_RUNNING ?
            sound.load().then(() => {
                this.loadedSoundsIndex++;
                return Promise.resolve();
            }) :
            Promise.resolve();
    }
    /**
     * Registers a callback function to be called during the game loop.
     * @param {Function} callback - The callback function to execute.
     * @param {number} [refreshRate=this.refreshRate] - The rate in ms at which the callback should be called (should be a multiple of the game refresh rate or will be rounded).
     */
    addCallback(callback, refreshRate = this.refreshRate) {
        this.callbacks.push({ fn : callback, refreshRate : this.normalizeRefrashRate(refreshRate), idleCounter : 0 });
    }
    /**
     * Called periodically to refresh the state of the game.
     */
    refresh() {
        this.gamepad.refresh();
        if (this.state === STATE_RUNNING) {
            this.sprites.forEach(sprite => { sprite.refresh(); });

            const deadCallbacks = [];
            for (let i = this.callbacks.length - 1; i >= 0; i--) {
                if (this.callbacks[i].idleCounter === this.callbacks[i].refreshRate - 1) {
                    const value = this.callbacks[i].fn();
                    if (typeof value === 'boolean'){
                        // If we have a boolean: 'true' means 'no more execution', 'false' means 'keep on executing'
                        if (value) {
                            deadCallbacks.push(i);
                        }
                    } else if (typeof value === 'number') {
                        // If we have a number it re-defines the time to the next call
                        this.callbacks[i].refreshRate = this.normalizeRefrashRate(value);
                        this.callbacks[i].idleCounter = 0;
                    }
                }
                this.callbacks[i].idleCounter = (this.callbacks[i].idleCounter + 1) % this.callbacks[i].refreshRate;
            }

            for (let i = deadCallbacks.length - 1; i >= 0; i--){
                this.callbacks.splice(deadCallbacks[i], 1);
            }
        }
    }
    /**
     * Clears all sprites, sounds, and optionally callbacks from the game.
     * @param {boolean} [clearCallbacks=false] - If true, also clears all registered callbacks.
     */
    clear(clearCallbacks) {
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
     * Mutes or unmutes all sounds in the game.
     * @param {boolean} muted - If true, mutes all sounds; if false, unmutes them.
     */
    muteSound(muted) {
        for (let i = this.sounds.length - 1 ; i >= 0; i --) {
            this.sounds[i].mute(muted);
        }
    }
    /**
     * Starts the game by initiating resource loading and game loop.
     * @param {Function} [callback] - Optional callback function to execute when the game is ready.
     */
    start(callback) {
        if (typeof callback === 'function') this._onReadyCallback = callback;
        this.preload();
    }
    /**
     * Pauses the game by changing state and hiding the scenegraph.
     */
    pause() {
        this.state = STATE_PAUSED;
        this.scenegraph.style.visibility = 'hidden';
    }
    /**
     * Resumes the game if it was paused and calls the callback once newly added resources are loaded.
     * @param {Function} [callback] - Optional callback function to execute when the game is ready.
     */
    resume(callback) {
        if (this.state === STATE_PAUSED){
            if (typeof callback === 'function') this._onReadyCallback = callback;
            this.preload();
        }
    }

    /**
     * Normalizes a refresh rate to be a multiple of the game's base refresh rate.
     * @param {number} rate - The refresh rate in milliseconds to normalize.
     * @returns {number} The normalized refresh rate (rounded to nearest multiple of game refresh rate).
     */
    normalizeRefrashRate(rate) {
        return Math.round(rate / this.refreshRate) || 1;
    }
}

Object.assign(Game.prototype, defaults);

export default Game;
