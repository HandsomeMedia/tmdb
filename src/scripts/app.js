import './components/filter-panel.js'

function init() {
  const filterPanel = document.createElement('filter-panel')
  document.body.append(filterPanel)
  filterPanel.addEventListener('filter-update', renderMovies)
}

function renderMovies(e) {
  console.log('renderMovies')
  document.body.insertAdjacentText('beforeend', e.detail)
}

init()
