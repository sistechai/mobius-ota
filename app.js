const path = require('path')
const http = require('http')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const routes = require('./routes')

const server = http.createServer(app)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'static')))

// main routes
app.use('/fw', routes)

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

// any routes that does not match above
app.get("*", (req, res) => {
  res.status(404).json({ message: "Route Not Found." })
})

PORT = 7580

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT} :)`)
})
