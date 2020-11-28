import Animation from '../engine/Animation';
import Item from '../Item';

export const animationBase = {
    imageURL : 'img/pills.png',
    numberOfFrame : 1
};

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
