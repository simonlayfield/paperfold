const express = require('express'),
  bodyParser = require('body-parser'),
  app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// SSR Svelte component
require('svelte/ssr/register')({
  extensions: ['.svelte']
});
const { Store } = require('svelte/store.umd.js');
const storyView = require('./src/components/views/story.svelte');

let db;

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://paperfoldUser:ifj7hkWC@ds153763.mlab.com:53763/paperfold', (err, client) => {

  if (err) return console.log(err);
  db = client.db('paperfold');
  app.listen(3000, () => {
    console.log('listening on 3000');
  });

});

// Data URLs
app.get('/userData', (req, res) => {
  let currentUser = req.query.user;
  db.collection('users').find({
    "username": currentUser
  }).toArray(function(err, results) {
    res.send(results[0]);
  });
});

app.get('/dashboardData', (req, res) => {
  let currentUser = req.query.user;

  db.collection('users').find({
    "username": currentUser
  }).toArray(function(err, results) {
    res.send(results[0].contributions);
  });

});

app.get('/storyData', (req, res) => {
  let storyId = req.query.id;
  db.collection('stories').find({
    "_id": storyId
  }).toArray(function(err, results) {
    res.send(results[0]);
  });
});

app.post('/addStory', (req, res) => {
  let currentUser = req.query.user;
  let newStoryId = 'default';

  let newStoryObj = Object.assign(req.body,{
    "progress": "0",
    "chapters": {
      "chapter1": {
        "title": "chapter title",
          "caption": "chapter caption",
          "illustration": "/image-source.jpg",
          "text": ""
      },
      "chapter2": {
        "title": "chapter title",
          "caption": "chapter caption",
          "illustration": "/image-source.jpg",
          "text": ""
      },
      "chapter3": {
        "title": "chapter title",
          "caption": "chapter caption",
          "illustration": "/image-source.jpg",
          "text": ""
      },
      "chapter4": {
        "title": "chapter title",
          "caption": "chapter caption",
          "illustration": "/image-source.jpg",
          "text": ""
      },
      "chapter5": {
        "title": "chapter title",
          "caption": "chapter caption",
          "illustration": "/image-source.jpg",
          "text": ""
      },
      "chapter6": {
        "title": "chapter title",
          "caption": "chapter caption",
          "illustration": "/image-source.jpg",
          "text": ""
      }
    }
  });

  db.collection('stories').insertOne(newStoryObj, (err, result) => {
    if (err) return console.log(err);
    newStoryId = result.insertedId;
    console.log('saved to database');
    db.collection('users').updateOne(
        {
          "username": currentUser
        }, {
          "$push": {
            "contributions": {
              "id": newStoryId,
              "title": req.body.title
            },
          }
        },
        function(err, result) {
          res.redirect("/");
        }
      );
  });

});

// Page URLs
app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.get(['/story', 'story.html'], (req, res) => {

  const data = {storyIdThing: req.query.id};
  const { html, css, head } = storyView.render(data);

  res.send(html);

});

app.get(['/illustration', 'illustration.html'], (req, res) => {
  res.sendFile(__dirname + '/public/illustration.html');
});
