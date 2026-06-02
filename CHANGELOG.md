# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Updated modules, including major version bumps for mocha, chai, eslint, dotenv-cli, jsdom, and sirv
- Pinned all dev dependency versions (removed semver ranges)
- Updated menu markup and styles

## [0.3.0] - 2025-12-24

### Changed

- **Gamepad Support**: Added full gamepad support with D-pad, analog stick, and Start button controls
- **Main Menu**: Added new main menu dialog with controls information and settings
  - Displayed keyboard, gamepad, and touch controls
  - Settings for sound and screen FX overlay
  - Accessible via ESC key or gamepad Start button
- **Arcade Screen FX Overlay**: Added retro arcade screen effect overlay with scanlines for authentic arcade feel
  - Toggleable via settings menu
  - Included light effects for enhanced visual experience

- **Refactored to Native ESM**: Migrated project to use native ES modules with import maps
  - Removed webpack bundler and all webpack dependencies
  - Used browser-native import maps for dependency resolution
  - Simplified build process
- **General Refactoring**: Simplified logic in various parts of the codebase for better maintainability

### Fixed

- Fixed various legacy bugs throughout the codebase

## [0.2.5] - 2025-03-16

### Changed

- Updated modules
- Removed Babel from build

### Fixed

- Several minor bug fixes

## [0.2.4] - 2024-10-31

### Changed

- Updated modules

### Fixed

- Fixed bug in frightened mode
- Fixed maps directory case

## [0.2.3] - 2024-04-01

### Changed

- Updated modules

## [0.2.2] - 2023-09-03

### Changed

- Moved CNAME to public

## [0.2.1] - 2023-09-03

### Changed

- Updated modules
- Simplified modes
- Added Timer class
- Updated HTML template
- Updated favicons

## [0.2.0] - 2026-05-31

### Changed

- Refactored code
- Switched to JS classes
- Improved some patterns
- Added scaling
- Larger image assets
- Removed dependencies
- Added custom game engine
- Used Webpack for building project
- Published demo to gh-pages

## [0.1.0] - 2026-05-31

### Changed

- Migrated build system from Grunt to Webpack with Babel transpilation
- Moved source files to `src/` directory
- Migrated test setup to Webpack-based runner
- Added Docker development script

## [0.0.1] - 2020-07-18

Initial GitHub release. The project originated in 2014 and was previously hosted on Bitbucket. This tag marks the state of the codebase at the time of migration.

[unreleased]: https://github.com/8tentaculos/jsPacman/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/8tentaculos/jsPacman/compare/v0.2.5...v0.3.0
[0.2.5]: https://github.com/8tentaculos/jsPacman/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/8tentaculos/jsPacman/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/8tentaculos/jsPacman/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/8tentaculos/jsPacman/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/8tentaculos/jsPacman/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/8tentaculos/jsPacman/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/8tentaculos/jsPacman/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/8tentaculos/jsPacman/releases/tag/v0.0.1
