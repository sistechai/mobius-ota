const path = require('path')
const http = require('http')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()

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

// web page
app.get('/', (req, res) => {
  res.sendFile('index.html')
})

// any routes that does not match above
app.get("*", (req, res) => {
  res.status(404).json({ message: "Route Not Found." })
})

// run servre
server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT} :)`)
})
