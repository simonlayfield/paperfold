const path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser'),
      multer = require("multer"),
      app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

const storage = multer.diskStorage({
  destination: './public/images/covers/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' +
      Date.now() +
      path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {fileSize: 1000000},
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('cover');

function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(extname && mimetype) {
    return cb(null, true);
  } else {
    return cb("Error: images only");
  }

};

// SSR Svelte component
require('svelte/ssr/register')({
  extensions: ['.svelte']
});

const { Store } = require('svelte/store.umd.js'),
      dashboardView = require('./src/components/views/dashboard.svelte'),
      storyView = require('./src/components/views/story.svelte'),
      illustrationSubmissionView = require('./src/components/views/illustration.svelte'),
      ObjectId = require('mongodb').ObjectId;

let db;

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://paperfoldUser:ifj7hkWC@ds153763.mlab.com:53763/paperfold', (err, client) => {

  if (err) return console.log(err);
  db = client.db('paperfold');
  app.listen(3000, () => {
    console.log('listening on 3000');
  });

});

// Data endpoints - will leave these here for now in case they come in handy

app.get('/userData', (req, res) => {
  let currentUser = req.query.user;

  db.collection('users').find({
    "username": currentUser
  }).toArray(function(err, results) {
    res.send(results[0]);
  });

});

// TODO May need to remove this or change it to a separate function
app.get('/storyData', (req, res) => {
  let storyId = req.query.id;
  db.collection('stories').find({
    "_id": storyId
  }).toArray(function(err, results) {
    res.send(results[0]);
  });
});

app.post('/upload', (req, res) => {

  upload(req, res, (err) => {
    if(err) console.log(err);
    console.log(req.file);
    res.send('done');
  });

});

// app.post('/upload', function(req, res) {
//   req.pipe(req.busboy);
//   req.busboy.on('file', function(fieldname, file, filename) {
//       var fstream = fs.createWriteStream('./public/images/covers/' + filename);
//       file.pipe(fstream);
//       fstream.on('close', function () {
//
//         db.collection('chapters').insertOne(req.body, (err, result) => {
//           if (err) return console.log(err);
//           res.send('ok!');
//         });
//
//       });
//   });
// });

app.post('/addStory', (req, res) => {
  let currentUser = req.query.user;
  let newStoryId = 'default';

  let newStoryObj = Object.assign(req.body, {
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

// Application Pages
app.get(['/', '/index.html'], (req, res) => {

  db.collection('users').find({
    "username": "simon"
  }).toArray(function(err, results) {
    if (err) return console.log(err);
    // Here's how I render out the component as a page
    // https://svelte.technology/guide#server-side-api
    const { html, head, css } = dashboardView.render(null, {
      store: new Store({
        currentUserData: results[0]
      })
    });
    // And I guess this is how express returns the page?
    res.write(head);
    res.write('<style>' + css.code + '</style>');
    res.write(html);
  });
});

app.get(['/story', 'story.html'], (req, res) => {
  // We need to know which story needs to be displayed in the view
  // We get this from the req object

  const currentStoryId = new ObjectId(req.query.id);

  db.collection('stories').find({
    "_id": currentStoryId
  }).toArray(function(err, results) {
    if (err) return console.log(err);
    // Here's how I render out the component as a page
    // https://svelte.technology/guide#server-side-api
    const { html, head, css } = storyView.render(null, {
      store: new Store({
        currentStoryData: results[0]
      })
    });
    // And I guess this is how express returns the page?
    res.write(head);
    res.write('<style>' + css.code + '</style>');
    res.write(html);
  });


});

app.get(['/illustration', 'illustration.html'], (req, res) => {
  const { html, head, css } = illustrationSubmissionView.render();
  // And I guess this is how express returns the page?
  res.write(head);
  res.write('<style>' + css.code + '</style>');
  res.write(html);
});
