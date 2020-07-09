import $ from 'jquery';
import Bonus from '../Bonus';

export default function(attrs, idx) {

    if (attrs.id === 'bot-bonus-1') idx = 0;
    else if (attrs.id === 'bot-bonus-2') idx = 1;
    else if (attrs.id === 'bot-bonus-3') idx = 2;
    else if (attrs.id === 'bot-bonus-4') idx = 3;
    else if (attrs.id === 'bot-bonus-5') idx = 4;
    else if (attrs.id === 'bot-bonus-6') idx = 5;
    else if (attrs.id === 'bot-bonus-7') idx = 6;
    else if (attrs.id === 'bot-bonus-8') idx = 7;

    return new Bonus({
        animations : {
            default : {
                offsetx : 30 * idx
            }
        },
        ...attrs
    });

}
