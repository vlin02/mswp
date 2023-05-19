# MSWP

Fast minesweeper solver library and TAS extension for Google Minesweeper

## Demo - 0sec Hard
![0sec-hard](https://github.com/vlin02/mswp/assets/41597231/0364021d-0682-4d24-976b-cf99bf68dfd0)

## Installation

- Download the repo ZIP file [here](https://github.com/vlin02/mswp/archive/master.zip)
- Unzip the file and you should have a folder named `mswp-main`
- In Chrome go to the extensions page (chrome://extensions)
- Enable Developer Mode
- Drag `mswp-main/builds/mswp-chrome` anywhere on the page to import it

## Google Minesweeper Stats
The solver is primarily bottlenecked in solve time by the "revealing" animation of each number square

Consistently solves:
- easy: 0s
- medium: 0s
- hard: 1s - 0s if you are lucky