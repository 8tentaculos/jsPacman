require.config({
    baseUrl : '../js/src',
    // paths config is relative to the baseUrl, and
    // never includes a ".js" extension since
    // the paths config could be for a directory.
    paths: {
        jquery : '../lib/jquery-1.10.2.min',
        gameQuery : '../lib/jquery.gamequery-0.7.1',
        chai : '../lib/chai',
        maps : '../maps'
    },
    shim: {
        gameQuery : ['jquery']
    }
});

require([
  '../../test/test'
], function() {
  if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
  else { mocha.run(); }
});