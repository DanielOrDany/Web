const bodyParser = require("body-parser")
const express = require('express')
const app = express()
const port = 3000

var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/"

MongoClient.connect(url, {useUnifiedTopology: true},function(err, db) {
    var dbo1 = db.db("kansas");
    dbo1.createCollection("comments", function (err, res) {
        if (err) throw err;
        console.log("Comments collection created!");
    });

    var dbo2 = db.db("kansas");
    dbo2.createCollection("news", function (err, res) {
        if (err) throw err;
        console.log("News collection created!");
    });
})

var comments = []
var news = []

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('kansas api -v 1.0.0')
})

app.get('/v1/me', (request, response) => {
    response.send(true)
})

app.get('/v1/comments', (request, response) => {
    MongoClient.connect(url,{useUnifiedTopology: true}, function (err, client) {
        if (err) throw err;

        var db = client.db('kansas');

        db.collection('comments').find()
            .toArray((err, results) => {
                if(err) throw err;

                results.forEach((value)=>{
                    comments.push([value.author, value.comment, value.date, value.time])
                });
            })

        client.close();
        response.send(comments)
    })
})

app.post('/v1/comment', (request, response) => {
    MongoClient.connect(url,{useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db("kansas");
        var myobj = { author: request.body.author, comment: request.body.comment, date: request.body.date, time: request.body.time};
        dbo.collection("comments").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    response.send('comment was successfuly sended to db!')
})

app.get('/v1/new', (request, response) => {
    MongoClient.connect(url,{useUnifiedTopology: true}, function (err, client) {
        if (err) throw err;

        var db = client.db('kansas');

        db.collection('news').find()
            .toArray((err, results) => {
                if(err) throw err;

                results.forEach((value)=>{
                    news.push([value.title, value.subtitle])
                });
            })

        client.close();
        response.send(news)
    })
})

app.post('/v1/new', (request, response) => {
    MongoClient.connect(url, {useUnifiedTopology: true},function(err, db) {
        if (err) throw err;
        var dbo = db.db("kansas");
        var myobj = { title: request.body.title, subtitle: request.body.subtitle};
        dbo.collection("news").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
        });
    });
    response.send('new was successfuly sended to db!')
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
})