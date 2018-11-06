const express = require('express'),
      bodyParser = require('body-parser'),
      app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

require('svelte/ssr/register')({
	extensions: ['.svelte']
});
const storyList = require('./src/components/views/dashboard.svelte');

let db;

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://paperfoldUser:ifj7hkWC@ds153763.mlab.com:53763/paperfold', (err, client) => {

  if (err) return console.log(err);

  db = client.db('paperfold');

  app.listen(3000, () => {
    console.log('listening on 3000');
  });

});

// Data urls
app.get('/userData', (req, res) => {
  let currentUser = req.query.user;
  db.collection('users').find({"username": currentUser}).toArray(function(err, results) {
    res.send(results);
  });
});
app.get('/dashboardData', (req, res) => {
  db.collection('stories').find().toArray(function(err, results) {
    res.send(results);
  });
});

app.get(['/', '/index.html'], (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.get(['/story', 'story.html'], (req, res) => {
  res.sendFile(__dirname + '/public/story.html');
});

app.get(['/illustration', 'illustration.html'], (req, res) => {
  res.sendFile(__dirname + '/public/illustration.html');
});

app.post('/storySubmission', (req, res) => {
  console.log(req.body);
});
