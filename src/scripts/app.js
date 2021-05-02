import './components/filter-panel.js'
import './components/movie-list.js'

const movieList = document.querySelector('movie-list')
const filterPanel = document.querySelector('filter-panel')

function init() {
  filterPanel.addEventListener('filter-update', handleMovieData)
}

function handleMovieData(e) {
  movieList.data = e.detail
}

init()
