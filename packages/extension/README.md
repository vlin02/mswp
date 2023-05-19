# @mswp/extension
Chrome extension that provides a UI next to google minesweeper to visualize and experiment with the solver

The extension activates at both 
- https://www.google.com/search?q=minewsweeper
- https://www.google.com/fbx?fbx=minesweeper

## Scripts

### `pnpm webpack:dev`

builds a development version of the chrome extension in `dist/dev` and watches for changes

### `pnpm webpack:prod`

builds a production version of the chrome extension in `dist/prod`

## Webpack

The webpack builds use the `src/content.tsx` entry. (`src/index.tsx` can be ignored and is for development only)
