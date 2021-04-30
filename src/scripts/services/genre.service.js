import { config } from '../config.js'

const genreService = {
  url: `${config.API_ORIGIN}/3/genre/movie/list`,
  list() {
    return fetch(`${this.url}?api_key=${config.API_KEY}`).then(response => response.json())
  }
}

export { genreService }
