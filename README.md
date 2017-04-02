![artwork.jpg](https://bitbucket.org/repo/BX8pn8/images/1695771410-artwork.jpg)

jsPacman
========

jsPacman is a Javascript remake of the classic [Ms Pac-Man](https://en.wikipedia.org/wiki/Ms._Pac-Man) game.
It is written in [JavaScript](https://en.wikipedia.org/wiki/JavaScript), using [jQuery](http://jquery.com/) and the [gameQuery](http://gamequeryjs.com/) plug-in.
Animations are made using pure CSS3 DOM manipulation. Sound is native HTML5.

Play Demo
-----------
[jspacman.bitbucket.io](http://jspacman.bitbucket.io/)

Credits
-----------
Code by [@AlbertChop](https://twitter.com/AlbertChop).
Game algorithm is based on [The Pac-Man Dossier](https://home.comcast.net/~jpittman2/pacman/pacmandossier.html).
Sprites are from [spriters-resource](http://www.spriters-resource.com/game_boy_advance/namcomuseum/sheet/22732).

Development
-----------

Install [nodejs and npm](http://www.nodejs.org/).

Then install globally [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs) and [grunt-cli](http://gruntjs.com/getting-started):
```
$ npm install -g mocha-phantomjs phantomjs
$ npm install -g grunt-cli
```
Then install local modules:
```
$ npm install
```
### Grunt tasks ###
Run tests and lint once:
```
$ grunt test
```
Run local server at localhost:8000
```
$ grunt &
```
Watch changes and run tests, lint and livereload:
```
$ grunt watch
```
Build (concatenate and uglify modules):
```
$ grunt build
```

Licences
-----------
Source code is under [MIT Licence](http://opensource.org/licenses/mit-license.php).