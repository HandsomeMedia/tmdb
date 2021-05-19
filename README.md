# Movie Database
Tests API search and filter functionality using API provided by TMDB (https://www.themoviedb.org/).
App demo: https://handsomemedia.github.io/tmdb/src/

## Notes
- The TMDB API doesn't allow query combined with advanced filtering (https://developers.themoviedb.org/3/search/search-movies).  Consequently, when a query is combined with filters, this app filters from the response set on client-side.  If filters are provided without query, this app fetches those results directly using separate endpoint.

- The TMDB API returns a max of 20 items per fetch/page

- This repo uses template literals for HTML/CSS in javascript files (denoted by `/*html*/`).  For proper syntax highlighting, install `es6-string-html` VS Code extension or similar

## To Run
- `npm install`

For development environment:
- `npm run dev`

To build files and run in production environment:
- `npm start`
