import Animation from '../engine/Animation';
import Bonus, { animations, animationBase } from '../Bonus';

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
