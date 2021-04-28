const template = /*html*/ `
<style>
  :host{
    display: block;
    background: blue;
  }

</style>
<article>
  <h1>TEST ARTICLE</h1>
</article>
`

class DisplayBlock extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.innerHTML = template
    this.addEventListener('change', this)
  }

  handleEvent(e) {
    const target = e.composedPath()[0]

    console.log('handle event', target)
  }

  disconnectedCallbback() {
    this.removeEventListener('change', this)
  }
}

customElements.define('display-block', DisplayBlock)
