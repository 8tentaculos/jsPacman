import $ from 'jquery';
import Bot from '../Bot';
import Mode from './Mode';

// SCATER
const Scatter = function(ghost) {
    Mode.apply(this, arguments);
};

$.extend(Scatter.prototype, Mode.prototype, {
    _getTarget : function() {
        return this.ghost.scatterTarget;
    }
});

export default Scatter;
