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

// files/* is accessed via req.params[0]
// but here we name it :file
app.get('/files/:file(*)', function(req, res, next){
  res.download(req.params.file, { root: FILES_DIR }, function (err) {
    if (!err) return; // file sent
    if (err.status !== 404) return next(err); // non-404 error
    // file for download not found
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  });
});

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
