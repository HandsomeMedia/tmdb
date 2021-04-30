import { movieService } from '../services/movie.service.js'
import { genreService } from '../services/genre.service.js'
import { dateInRange, arraysHaveMatch } from '../utils.js'

const template = /*html*/ `
<style>
  :host{
    overflow-y: auto;
    background-color: rgba(0,0,0,.5);
    padding: var(--space-lg);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }

  form{
    display: grid;
    align-items: center;
    text-align: right;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 36px;
    gap: var(--space-md);
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
    border-bottom: 4px solid var(--tan);
  }

  button,
  input,
  label{
    height: 100%;
    margin: 0;
    padding: 0;
    border: 2px solid var(--dark-gray);
    border-radius: var(--border-radius);
    font-family: var(--primary-font);
    font-size: 1rem;
    color: white;
    background-color: transparent;
    outline: none;
    overflow: hidden;
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
    padding: 0 var(--space-sm);
  }

  input[type="checkbox"]{
    display: none;
  }

  input[type="checkbox"] + span{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    pointer-events: none;
    transition: background-color .2s ease-out;
  }

  input[type="checkbox"]:checked + span{
    background-color: rgba(255,255,255,.2);
  }

  button[type="submit"]{
    grid-column: span 2;
    background-color: var(--orange);
    border: none;
    text-shadow: 0 0 2px black;
  }

  button[type="submit"]:active{
    filter: brightness(1.25);
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
    <input name="title" type="search" autocomplete="off" required>
  </fieldset>

  <fieldset>
    <legend>FILTER BY RELEASE DATE</legend>
    After:<input name="date" type="date" placeholder="yyyy-mm-dd">
    Before:<input name="date" type="date" placeholder="yyyy-mm-dd">
  </fieldset>

  <fieldset name="genres">
    <legend>FILTER BY GENRE</legend>
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

class FilterPanel extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = template
    this.form = this.shadowRoot.querySelector('form')
    this.genreFieldset = this.shadowRoot.querySelector('[name="genres"]')
    this.populateGenreFieldset()
    this.addEventListener('click', this)
  }

  async populateGenreFieldset() {
    // TODO: add loading indicator
    const { genres } = await genreService.list()
    const html = genres.reduce((acc, cur) => {
      acc += genreInput(cur.name, cur.id)
      return acc
    }, '')

    this.genreFieldset.insertAdjacentHTML('beforeend', html)
    // TODO: return genreMap from genreService and use it to populate inputs
    this.genreMap = new Map(genres.map(i => [i.id, i.name]))
  }

  async handleEvent(e) {
    const target = e.composedPath()[0]

    switch (target.name) {
      case 'submit':
        this.handleSubmit(e)
        break
    }
  }

  async handleSubmit(e) {
    // TODO: allow search by genre and date without requiring title
    e.preventDefault()

    // TODO: add better input validation
    if (!this.form.reportValidity()) return

    const formData = new FormData(this.form)
    const title = formData.get('title')
    const genres = formData.getAll('genre').map(str => parseInt(str))
    const dates = formData.getAll('date')
    const { results } = await movieService.searchByTitle(title)

    this.movies = results
    this.movies.forEach(movie => (movie.genre_names = movie.genre_ids.map(id => this.genreMap.get(id))))

    if (dates.some(date => date)) this.movies = this.filterByDate(this.movies, dates)
    if (genres.length) this.movies = this.filterByGenre(this.movies, genres)

    console.log(this.movies)
    this.dispatchEvent(
      new CustomEvent('filter-update', {
        detail: this.movies
      })
    )

    return this.movies
  }

  filterByDate(movies, dates) {
    return movies.filter(movie => dateInRange(movie.release_date, dates))
  }

  filterByGenre(movies, genres) {
    return movies.filter(movie => arraysHaveMatch(movie.genre_ids, genres))
  }

  disconnectedCallbback() {
    this.removeEventListener('click', this)
  }
}

customElements.define('filter-panel', FilterPanel)
