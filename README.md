jsPacman
========

Javascript version of the classic arcade.

Development
-----------

You need node and npm.
Then install globally [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs) and [grunt-cli](http://gruntjs.com/getting-started):
```
$ npm install -g mocha-phantomjs phantomjs
$ npm install -g grunt-cli
```
Then:
```
$ npm install
```
Run tests and lint once:
```
$ grunt test
```
Run server:
```
$ grunt &
```
Watch changes and run tests, lint and livereload:
```
$ grunt watch
```