import Pacman from '../Pacman.js';

/**
 * Sprite type constant for Ms. Pacman.
 * @constant {string}
 */
export const SPRITE_MS_PACMAN = 'SPRITE_MS_PACMAN';

/**
 * Factory function to create a Ms. Pacman instance.
 * @param {Object} options - Configuration options passed to Pacman constructor.
 * @returns {Pacman} A new Pacman instance configured as Ms. Pacman.
 */
export default (options) => new Pacman({
    x : 452,
    y : 848,
    type : SPRITE_MS_PACMAN,
    ...options
});
