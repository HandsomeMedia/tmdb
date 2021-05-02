import { config } from '../config.js'

// TODO: handle errors

const movieService = {
  url: `${config.API_ORIGIN}/3/search/movie`,
  async searchByTitle(title, page = 1) {
    const { results } = await fetch(`${this.url}?api_key=${config.API_KEY}&query=${title}&page=${page}&include_adult=false`).then(response => response.json())
    return results
  }
}

export { movieService }
