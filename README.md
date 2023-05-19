# MSWP

Fast minesweeper solver library and extension for Google Minesweeper

## Demo
https://github.com/vlin02/mswp/assets/41597231/bdf8a99c-769c-4152-8425-034a109ffa0c

## Installation

- Download the repo ZIP file [here](https://github.com/vlin02/mswp/archive/master.zip)
- Unzip the file and you should have a folder named `mswp-main`
- In Chrome go to the extensions page (chrome://extensions)
- Enable Developer Mode
- Drag `mswp-main/builds/mswp-chrome` anywhere on the page to import it

## Google Minesweeper Stats
The solver is primarily bottlenecked in solve time by the "revealing" animation of each number square.

Consistently solves:
- easy: 0s
- medium: 0s
- hard: 1s - 0s if you are lucky