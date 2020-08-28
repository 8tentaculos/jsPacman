import Animation, { ANIMATION_VERTICAL } from '../engine/Animation';
import Item from '../Item';

const animationBase = {
    imageURL : 'img/pills.png',
    numberOfFrame : 2,
    delta : 24,
    rate : 450,
    type : ANIMATION_VERTICAL
};

export default (options) => new Item({
    width : 24,
    height : 24,
    animations : {
        'white' : new Animation({
            ...animationBase
        }),
        'yellow' : new Animation({
            ...animationBase,
            offsetx : 24 + 8
        }),
        'red' : new Animation({
            ...animationBase,
            offsetx : (24 + 8) * 2
        })
    },
    ...options
});
