const bodyParser = require("body-parser");
const express = require('express')
const app = express()
const port = 3000

var array = []
var news = []

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('kansas api -v 1.0.0')
})

app.get('/v1/me', (request, response) => {
    response.send(true)
})

app.get('/v1/comments', (request, response) => {
    response.send(array)
})

app.post('/v1/comment', (request, response) => {
    array.push([request.body.author, request.body.comment, request.body.date, request.body.time])
    console.log(array)
    response.send('successful')
})

app.get('/v1/new', (request, response) => {
    response.send(news)
})

app.post('/v1/new', (request, response) => {
    news.push([request.body.title, request.body.subtitle])
    console.log(news)
    response.send('successful')
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})