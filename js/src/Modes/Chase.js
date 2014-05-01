define(['jquery', 'Bot', 'Modes/Mode'], function($, Bot, Mode) {
    // CHASE
    var Chase = function(ghost) {
        Mode.apply(this, arguments);
    };

    $.extend(Chase.prototype, Mode.prototype, {
        _getTarget : function() {
            return this.ghost.getChaseTarget();
        }
    });

    return Chase;
});