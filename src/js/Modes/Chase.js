import $ from 'jquery';
import Bot from '../Bot';
import Mode from './Mode';

// CHASE
const Chase = function(ghost) {
    Mode.apply(this, arguments);
};

$.extend(Chase.prototype, Mode.prototype, {
    _getTarget : function() {
        return this.ghost.getChaseTarget();
    }
});

export default Chase;
