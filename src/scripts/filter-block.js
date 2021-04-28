import { API_ORIGIN, API_KEY } from './config.js'
import { dateInRange, arrayItemMatch } from './utils.js'

const template = /*html*/ `
<style>
  :host{
    overflow-y: auto;
  }

  form{
    display: grid;
    align-items: center;
    text-align: right;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 48px;
    gap: var(--space-md);
    background-color: rgba(0,0,0,.5);
    padding: var(--space-lg);
  }

  fieldset{
    display: contents;
    border: none;
    margin: 0;
    padding: 0;
  }

  legend{
    grid-column: span 2;
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border-bottom: 4px solid var(--medium-blue);
  }

  button,
  input,
  label{
    height: 100%;
    margin: 0;
    padding: 0;
    border: 1px solid var(--gray);
    border-radius: var(--border-radius);
    font-family: var(--primary-font);
    font-size: 1rem;
    color: white;
    background-color: black;
    outline: none;
  }

  button,
  label{
    cursor: pointer;
  }

  input[type="search"]{
    grid-column: span 2;
    padding: 0 var(--space-md);
  }

  input[type="date"]{
    padding: 0 var(--space-md);
  }

  input[type="checkbox"]{
    display: none;
  }

  input[type="checkbox"] + span{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-clip: border;
    pointer-events: none;
  }

  input[type="checkbox"]:checked + span{
    background-color: var(--medium-blue);
  }

  button[type="submit"]{
    grid-column: span 2;
    background-color: var(--pex-blue);
    border: none;
  }

  ::-webkit-search-cancel-button{
    filter: brightness(3) grayscale(1);
    cursor: pointer;
  }

  ::-webkit-calendar-picker-indicator {
    filter: invert(1);
    cursor: pointer;
  }
</style>

<form>
  <fieldset>
    <legend>SEARCH BY TITLE</legend>
    <input name="title" type="search" autocomplete="off">
  </fieldset>

  <fieldset name="genres">
    <legend>FILTER BY GENRE</legend>
  </fieldset>

  <fieldset>
    <legend>FILTER BY RELEASE DATE</legend>
    After:<input name="date" type="date" placeholder="yyyy-mm-dd">
    Before:<input name="date" type="date" placeholder="yyyy-mm-dd">
  </fieldset>

  <fieldset>
    <legend></legend>
    <button name="submit" type="submit">SEARCH</button>
  </fieldset>
</form>
`

const genreInput = (title, id) => /*html*/ `
  <label>
    <input name="genre" type="checkbox" value="${id}">
    <span>${title}</span>
  </label>
`

class FilterBlock extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = template
    this.form = this.shadowRoot.querySelector('form')
    this.initGenres()
    this.addEventListener('click', this)
  }

  async initGenres() {
    const { genres } = await fetch(`${API_ORIGIN}/3/genre/movie/list?api_key=${API_KEY}`).then(response => response.json())
    const html = genres.reduce((str, genre) => {
      str += genreInput(genre.name, genre.id)
      return str
    }, '')

    this.shadowRoot.querySelector('[name="genres"]').insertAdjacentHTML('beforeend', html)
  }

  async handleEvent(e) {
    const target = e.composedPath()[0]

    console.log('handle event', target)

    switch (target.name) {
      case 'submit':
        this.handleSubmit(e)
        break
    }
  }

  async handleSubmit(e) {
    e.preventDefault()

    // TODO: add input validation
    const fd = new FormData(this.form)
    const genres = fd.getAll('genre').map(str => parseInt(str))
    const dates = fd.getAll('date')
    const moviesByTitle = await this.getMoviesByTitle(fd.get('title'))
    this.movies = this.filterMovies(moviesByTitle, genres, dates)
    console.log(moviesByTitle)
    console.log(this.movies)
    // TODO: dispatch event
  }

  async getMoviesByTitle(title, page = 1) {
    const response = await fetch(`${API_ORIGIN}/3/search/movie?api_key=${API_KEY}&query=${title}&page=${page}&include_adult=false`).then(response => response.json())
    // TODO: handle response errors
    return response.results
  }

  filterMovies(movies, genres, dates) {
    const filterGenres = Boolean(genres.length)
    const filterDates = dates.some(date => date)

    if (!filterGenres && !filterDates) return movies

    let genreMatch = true
    let dateMatch = true
    const filtered = movies.reduce((arr, movie) => {
      if (filterGenres) genreMatch = arrayItemMatch(movie.genre_ids, genres)
      if (filterDates) dateMatch = dateInRange(movie.release_date, dates)
      if (genreMatch && dateMatch) arr.push(movie)
      return arr
    }, [])

    return filtered
  }

  disconnectedCallbback() {
    this.removeEventListener('click', this)
  }
}

customElements.define('filter-block', FilterBlock)
