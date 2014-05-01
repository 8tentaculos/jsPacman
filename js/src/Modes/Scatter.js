define(['jquery', 'Bot', 'Modes/Mode'], function($, Bot, Mode) {
    // SCATER
    var Scatter = function(ghost) {
        Mode.apply(this, arguments);
    };

    $.extend(Scatter.prototype, Mode.prototype, {
        _getTarget : function() {
            return this.ghost.scatterTarget;
        }
    });

    return Scatter;
});