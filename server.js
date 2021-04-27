import express from 'express'
import path from 'path'

const port = process.env.PORT || 3000
const rootDir = path.resolve(path.dirname(''))
const appDir = process.env.NODE_ENV === 'development' ? 'src' : 'dist'
const server = express()

server.use(express.static(path.join(rootDir, appDir)))

server.listen(port, () => console.log(`Server is listening at localhost:${port}`))

export { server }
