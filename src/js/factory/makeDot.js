import Animation from '../engine/Animation.js';
import Item from '../Item.js';

/**
 * Base animation configuration for dots.
 * @type {Object}
 */
export const animationBase = {
    imageURL : 'img/pills.png',
    numberOfFrame : 1
};

/**
 * Factory function to create a dot item.
 * @param {Object} options - Configuration options passed to Item constructor.
 * @returns {Item} A new Item instance representing a dot.
 */
export default options => new Item({
    width : 8,
    height : 8,
    defaultAnimation : 'white',
    animations : {
        'white' : new Animation({
            ...animationBase,
            offsetX : 24
        }),
        'yellow' : new Animation({
            ...animationBase,
            offsetX : 24 + 32
        }),
        'red' : new Animation({
            ...animationBase,
            offsetX : 24 + 32 * 2
        })
    },
    ...options
});
