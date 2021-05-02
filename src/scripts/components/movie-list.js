import './movie-card.js'

const template = /*html*/ `
<style>
  :host{
    contain: strict;
  }

  ul{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
    gap: var(--space-lg);
    padding: var(--space-lg) 0;
    list-style: none;
  }
</style>

<ul></ul>
`

class MovieList extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = template
    this.ul = this.shadowRoot.querySelector('ul')
  }

  set data(movies) {
    this.render(movies)
  }

  render(movies) {
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

    this.ul.replaceChildren(frag)
  }
}

customElements.define('movie-list', MovieList)
