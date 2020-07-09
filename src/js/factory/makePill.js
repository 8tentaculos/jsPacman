import $ from 'jquery';
import Item from '../Item';

export default (attrs) => new Item({
    w : 12,
    h : 12,
    animationBase : {
        imageURL : 'img/pills.png',
        numberOfFrame : 2,
        delta : 12,
        rate : 450,
        type : $.gQ.ANIMATION_VERTICAL
    },

    defaultAnimation : 'white',

    animations : {
        white : {},
        yellow : {
            offsetx : 12 + 4
        },
        red : {
            offsetx : (12 + 4) * 2
        }
    },
    ...attrs
});
