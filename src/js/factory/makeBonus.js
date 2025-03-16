import Animation from '../engine/Animation.js';
import Bonus, { animations, animationBase } from '../Bonus.js';

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
