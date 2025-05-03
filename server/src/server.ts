import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import routes from './routes/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

console.log('API_KEY:     ', process.env.API_KEY)
console.log('API_BASE_URL:', process.env.API_BASE_URL)

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '../../client/dist')))
app.use(routes)
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))
