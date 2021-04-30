import { formatDate } from '../utils.js'

const template = data => /*html*/ `
<style>
  :host{
    display: block;
  }

  article{
    display: inline-grid;
    gap: var(--space-sm) var(--space-md);
    grid-template-rows: auto auto auto;
    grid-template-columns: auto 1fr;
    width: min(480px, 100%);
    padding-right: var(--space-md);
    background-color: rgba(0,0,0,.5);
    border-radius: var(--border-radius);
    overflow: hidden;  }

  .poster{
    background-color: #dfd8d0;
    grid-row: span 3;
  }

  .title{
    font-size: 1rem;
    margin: var(--space-md) 0 0;
    text-transform: uppercase;
  }

  .details{
    font-size: .75rem;
    color: var(--gray);
  }

  .description{
    font-size: .875rem;
    color: var(--light-gray);
    margin: 0 0 var(--space-sm);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

<article>
  <img class="poster" src="https://image.tmdb.org/t/p/w92${data.poster_path}" width="92" height="138">
  <h3 class="title">${data.title}</h3>
  <div class="details">
    <time datetime="${data.release_date}">${formatDate(data.release_date)}</time> &nbsp;|&nbsp; <span>${data.genre_names.join(', ')}</span>
  </div>
  <p class="description">${data.overview}</p>
</article>
`

class MovieCard extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = template(this.data)
    this.shadowRoot.querySelector('.poster').addEventListener('error', this)
  }

  handleEvent(e) {
    const target = e.composedPath()[0]

    switch (e.type) {
      case 'error':
        target.src = 'assets/default-image.svg'
        break
    }
  }

  disconnectedCallbback() {}
}

customElements.define('movie-card', MovieCard)
