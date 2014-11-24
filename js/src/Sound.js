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
                intro : new SoundWrapper('audio/intro.mp3'),
                back : new SoundPool('audio/back.wav', 10),
                dot : new SoundPool('audio/dot.wav', 10),
                eaten : new SoundWrapper('audio/eaten.mp3'),
                eat : new SoundPool('audio/eat.wav', 4),
                frightened : new SoundWrapper('audio/frightened.mp3'),
                dead : new SoundPool('audio/dead.wav', 10),
                bonus : new SoundWrapper('audio/bonus.mp3'),
                life : new SoundWrapper('audio/life.mp3')
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