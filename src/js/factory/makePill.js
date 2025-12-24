import Animation, { ANIMATION_VERTICAL } from '../engine/Animation.js';
import Item from '../Item.js';

/**
 * Base animation configuration for power pills.
 * @type {Object}
 */
const animationBase = {
    imageURL : 'img/pills.png',
    numberOfFrame : 2,
    delta : 24,
    refreshRate : 450,
    type : ANIMATION_VERTICAL
};

/**
 * Factory function to create a power pill item.
 * @param {Object} options - Configuration options passed to Item constructor.
 * @returns {Item} A new Item instance representing a power pill.
 */
export default (options) => new Item({
    width : 24,
    height : 24,
    animations : {
        'white' : new Animation({
            ...animationBase
        }),
        'yellow' : new Animation({
            ...animationBase,
            offsetX : 24 + 8
        }),
        'red' : new Animation({
            ...animationBase,
            offsetX : (24 + 8) * 2
        })
    },
    ...options
});
