import { config } from '../config.js'

const movieService = {
  url: `${config.API_ORIGIN}/3/search/movie`,
  searchByTitle(title, page = 1) {
    // TODO: handle response errors
    return fetch(`${this.url}?api_key=${config.API_KEY}&query=${title}&page=${page}&include_adult=false`).then(response => response.json())
  }
}

export { movieService }
