// WIP
// TODO: hook up cache service

const provider = ''

const cache = {
  set(key, value, ttl = 600) {
    provider.set(key, value, ttl)
    return true
  },
  get(key) {
    return provider.get(key)
  },
  has(key) {
    return provider.has(key)
  }
}

export { cache }
