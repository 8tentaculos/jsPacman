<p align="center">
    <img alt="jsPacman logo" src="src/img/stuff/art.png">
</p>

# jsPacman

A DOM-based remake of [Ms. Pac-Man](https://en.wikipedia.org/wiki/Ms._Pac-Man) built with vanilla JavaScript.  
Uses native ES modules with import maps, no bundler needed.  
Built on [rasti](https://github.com/8tentaculos/rasti) for models, event emitters, and minimal view management.  
Sprites positioned and animated with CSS transforms. Audio handled via Web Audio API.  
Supports keyboard, gamepad (Gamepad API), and touch input. High scores and settings saved to localStorage.

## Play Demo

**[https://8tentaculos.github.io/jsPacman/](https://8tentaculos.github.io/jsPacman/)**

## Features

* Classic Ms. Pac-Man gameplay with multiple mazes and levels
* Ghost AI with scatter/chase behavior patterns
* Scaling support for different screen sizes
* Cornering behavior for faster movement
* Power pills and bonus items
* Score system with high score tracking
* Lives system with extra life bonuses
* Multiple input methods: keyboard, gamepad, and touch controls
* Main menu with settings and controls info
* Arcade-style screen FX overlay with scanlines (toggleable)
* Sound effects and music

## Credits

* Game algorithm is based on [The Pac-Man Dossier](https://pacman.holenet.info/) by Jamey Pittman.
* Sprites are from [The Spriters Resource](https://www.spriters-resource.com/game_boy_advance/namcomuseum/sheet/22732/) (Namco Museum, Game Boy Advance).
* Sound effects reproduce the original game's audio.
* Font is [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) by CodeMan38, licensed under the [SIL Open Font License](src/fonts/OFL.txt).
* Built on [rasti](https://github.com/8tentaculos/rasti).

## History

I started this project in 2013, after about eight years working as a frontend developer on real-time, data-intensive JavaScript applications. At the time, most browser games were still built with Flash, and I wanted to explore what was possible using open web technologies.

To stay focused on game mechanics and 2D game algorithms rather than game design, I chose to remake an existing classic. The first version, released in 2014, used DOM-based rendering instead of canvas (which was not yet widely supported), along with jQuery, a simple game plugin, AMD modules, and Grunt.

Over time, the project went through several refactors while keeping the DOM rendering approach. Dependencies were removed, a small custom game engine was introduced and modern Web APIs were adopted. The current version uses native ES modules in the browser with import maps, removes bundlers entirely, and adds features like scaling, touch, and gamepad support.

**jsPacman** is both a playable game and a long-running experiment in browser-based game development.

## Development

Install dependencies:
```
$ npm install
```

### NPM scripts ###

Run tests:
```
$ npm test
```

Start development server at `localhost:3000`:
```
$ npm start
```

Preview production build at `localhost:3000`:
```
$ npm run preview
```

Build production bundle:
```
$ npm run build
```

The project uses native ES modules with import maps, so no bundler is required during development. The build script only minifies and copies files to the `dist` directory.

## License

The MIT [License](LICENSE) covers only the source code written for this project.

It does not cover the game design, characters, names, artwork, sprites, or sounds. *Pac-Man* and *Ms. Pac-Man* are trademarks of Bandai Namco Entertainment Inc., and all related assets are the property of their respective owners. They are included here solely for non-commercial, educational purposes. This project is not affiliated with or endorsed by Bandai Namco.

The Press Start 2P font is distributed under its own license ([OFL](src/fonts/OFL.txt)).

## Contributing

Contributions are welcome! Share feature ideas or report bugs on our [GitHub Issues page](https://github.com/8tentaculos/jsPacman/issues).
