import { config } from '../config.js'

// TODO: Handle errors

const genreService = {
  url: `${config.API_ORIGIN}/3/genre/movie/list`,
  async getList() {
    const { genres } = await fetch(`${this.url}?api_key=${config.API_KEY}`).then(response => response.json())
    return genres
  },
  async getMap() {
    const genreArr = await this.getList()
    return new Map(genreArr.map(i => [i.id, i.name]))
  }
}

export { genreService }
