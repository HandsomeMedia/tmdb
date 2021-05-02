import { config } from '../config.js'

// TODO: handle errors

const movieService = {
  async getGenreMap() {
    if (this.genreMap) return this.genreMap

    const url = `${config.API_ORIGIN}/3/genre/movie/list?api_key=${config.API_KEY}`
    const response = await fetch(url).then(response => response.json())

    this.genreMap = new Map(response.genres.map(i => [i.id, i.name]))
    return this.genreMap
  },
  async searchByTitle(title, page = 1) {
    const url = `${config.API_ORIGIN}/3/search/movie?api_key=${config.API_KEY}&query=${title}&page=${page}`
    const response = await fetch(url).then(response => response.json())
    const genreMap = await this.getGenreMap()

    response.results.forEach(movie => (movie.genre_names = this.decodeGenreIDs(movie.genre_ids, genreMap)))

    console.log('API request:', url)
    console.log('API response:', response.results)
    return response.results
  },
  async searchByFilters(genres, dateRange, page = 1) {
    const url = `${config.API_ORIGIN}/3/discover/movie?api_key=${config.API_KEY}&with_genres=${genres}&release_date.gte=${dateRange[0]}&release_date.lte=${dateRange[1]}&page=${page}`
    const response = await fetch(url).then(response => response.json())
    const genreMap = await this.getGenreMap()

    response.results.forEach(movie => (movie.genre_names = this.decodeGenreIDs(movie.genre_ids, genreMap)))

    console.log('API request:', url)
    console.log('API response:', response.results)
    return response.results
  },
  decodeGenreIDs(genreIds, genreMap) {
    // returns array of genre names corresponding to genre IDs
    return genreIds.map(id => genreMap.get(id))
  }
}

export { movieService }
