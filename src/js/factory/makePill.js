import $ from 'jquery';
import Item from '../Item';

export default (attrs) => new Item({
    w : 24,
    h : 24,
    animationBase : {
        imageURL : 'img/pills.png',
        numberOfFrame : 2,
        delta : 24,
        rate : 450,
        type : $.gQ.ANIMATION_VERTICAL
    },

    defaultAnimation : 'white',

    animations : {
        white : {},
        yellow : {
            offsetx : 24 + 8
        },
        red : {
            offsetx : (24 + 8) * 2
        }
    },
    ...attrs
});
