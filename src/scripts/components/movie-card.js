import { formatDate } from '../utils.js'

const template = data => /*html*/ `
<style>
  *{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :host{
    display: flex;
    height: 138px;
    background: linear-gradient(45deg, black 0%, var(--dark-blue) 100%);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    animation: fade-in .5s var(--delay) ease-out both;
    overflow: hidden;
  }

  .poster{
    width: 92px;
    height: 100%;
    background-color: var(--light-gray);
    object-fit: cover;
  }

  article{
    flex: 1;
    padding: var(--space-md);
    border-bottom: 6px solid var(--dark-gray);
    line-height: 1.4;
  }

  .title{
    font-size: var(--h3-size);
    font-weight: normal;
    margin-bottom: var(--space-sm);
    text-transform: uppercase;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .release-date,
  .genres{
    font-size: .75rem;
    color: var(--gray);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .genres li{
    display: inline-block;
  }

  .genres li + li::before {
    content: ', ';
  }

  @keyframes fade-in{
    from{
      opacity: 0;
    }
    to{
      opacity: 1;
    }
  }
</style>

<figure>
  <img class="poster" src="https://image.tmdb.org/t/p/w92${data.poster_path}" width="92" height="138" loading="lazy" title="${data.title}" alt="Poster image of ${data.title}">
</figure>
<article>
  <h3 class="title">${data.title}</h3>
  <time class="release-date" datetime="${data.release_date}">${formatDate(data.release_date)}</time>
  <ul class="genres">${data.genre_names.map(name => `<li>${name}</li>`).join('')}</ul>
</article>
`

class MovieCard extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = template(this.data)
    this.style.setProperty('--delay', `${this.num / 60}s`)
    this.poster = this.shadowRoot.querySelector('.poster')
    this.poster.addEventListener('error', this)
  }

  handleEvent(e) {
    const target = e.composedPath()[0]

    switch (e.type) {
      case 'error':
        target.src = 'assets/default-image.svg'
        break
    }
  }

  disconnectedCallbback() {
    this.poster.removeEventListener('error', this)
  }
}

customElements.define('movie-card', MovieCard)
