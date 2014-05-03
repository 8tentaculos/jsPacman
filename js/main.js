requirejs.config({
    baseUrl : 'js/src',
    // paths config is relative to the baseUrl, and
    // never includes a ".js" extension since
    // the paths config could be for a directory.
    paths: {
        jquery : '../lib/jquery-1.10.2.min',
        gameQuery : '../lib/jquery.gamequery-0.7.1',
        soundWrapper : '../lib/jquery.gamequery.soundwrapper.html5-0.6.0'
    },
    shim: {
        gameQuery : ['jquery']
    }
});

// Start the main app logic.
requirejs(['jquery', 'Game'],
    function($, Game) {
        $(function() {
            var game = new Game('.playground');
        });
    }
);