define([
'jquery', 
'SoundWrapper', 
'SoundPool', 
'gameQuery'
], function($, SoundWrapper, SoundPool) {
    var Sound = {
        active : true,

        init : function(active) {
            this.active = active;
            if (!this.active) return;

            this.sounds = {
                intro : new $.gQ.SoundWrapper('audio/intro.mp3'),
                back : new SoundPool('audio/back.mp3', 20),
                dot : new SoundPool('audio/dot.mp3', 20),
                eaten : new $.gQ.SoundWrapper('audio/eaten.mp3')
            };
        },
        
        play : function(label) {
            if (!this.active) return;
            this.sounds[label].play();
        },

        muted : function(muted) {
            $.muteSound(muted);
        }

    };

    return Sound;

});