import Animation from '../engine/Animation.js';
import Bonus, { animations, animationBase } from '../Bonus.js';

/**
 * Factory function to create a bonus item with a specific index.
 * @param {number} index - The bonus index (0-7) determining which bonus sprite to use.
 * @param {Object} options - Configuration options passed to Bonus constructor.
 * @returns {Bonus} A new Bonus instance.
 */
export default (index, options) => new Bonus({
    animations : {
        ...animations,
        default : new Animation({
            ...animationBase,
            offsetX : 60 * index
        })
    },
    ...options
});
