import './components/filter-panel.js'
import './components/movie-card.js'

const movieListEl = document.querySelector('.movie-list')

function init() {
  const filterPanel = document.createElement('filter-panel')

  filterPanel.toggleAttribute('hidden', true)
  document.body.append(filterPanel)
  filterPanel.addEventListener('filter-update', renderMovies)
}

function renderMovies(e) {
  const movies = e.detail
  const frag = document.createDocumentFragment()
  let li, card

  movies.forEach((movie, i) => {
    card = document.createElement('movie-card')
    card.data = movie
    card.num = i
    li = document.createElement('li')
    li.append(card)
    frag.append(li)
  })

  movieListEl.replaceChildren(frag)
}

init()
