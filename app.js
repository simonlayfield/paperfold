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
// https://www.youtube.com/watch?v=9Qzmri1WaaE
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
      completeView = require('./src/components/views/complete.svelte'),
      ObjectId = require('mongodb').ObjectId;

let db;

const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://paperfoldUser:ifj7hkWC@ds153763.mlab.com:53763/paperfold', (err, client) => {

  if (err) return console.log(err);
  db = client.db('paperfold');
  app.listen(8080, () => {
    console.log('listening on 8080');
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

    const newChapterObj = {
      "title": req.body.title,
      "caption": req.body.caption,
      "imageSrc": req.file.filename
    };

    db.collection('chapters').insertOne(newChapterObj, (err, result) => {
      if (err) return console.log(err);
      res.redirect('/complete');
    });

  });

});

app.post('/addChapterText', (req, res) => {

  let currentStoryId = new ObjectId(req.query.id),
      currentStoryData,
      currentProgress = req.body.storyProgress;

  db.collection('stories').find({"_id": currentStoryId}).toArray(function(err, results) {
    currentStoryData = results[0];

    currentStoryData.progress = parseInt(req.body.storyProgress) + 1;
    currentStoryData.chapters[currentProgress].text = req.body.storyField;

    db.collection('stories').update({
      "_id": currentStoryId
    },
      currentStoryData
    );

    if(currentStoryData.progress < 4) {
      res.redirect('/story?id=' + req.query.id);
    } else {
      res.redirect('/');
    }
    res.end();

  });

});

app.post('/addStory', formHandler, homeCtrl);

function formHandler (req, res, next) {

  if (req.body.title === "") {
    req.params = {
      formIsInvalid: true
    };
    return next();
  } else {
    req.params = {
      formIsInvalid: false
    };
  }

  let currentUser = req.query.user,
      newStoryId = 'default',
      newStoryChapters,
      newStoryObj;

  db.collection('chapters').aggregate([{ $sample: { size: 3 } }]).toArray(function(err, results) {
    if(err) console.log(err);
    newStoryChapters = results;
    newStoryObj = Object.assign(req.body, {
      "progress": "0",
      "chapters": newStoryChapters
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
              return next();
          }
        );
    });

  });


}

function homeCtrl (req, res) {

  db.collection('users').find({
    "username": "simon"
  }).toArray(function(err, results) {
    if (err) return console.log(err);
    // Here's how I render out the component as a page
    // https://svelte.technology/guide#server-side-api
    const { html, head, css } = dashboardView.render(null, {
      store: new Store({
        currentUserData: results[0],
        formIsInvalid: req.params.formIsInvalid
      })
    });
    // And I guess this is how express returns the page?
    res.write(head);
    res.write('<style>' + css.code + '</style>');
    res.write(html);
    res.end();
  });

}

// Application Pages
app.get(['/', '/index.html'], formHandler, homeCtrl);

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
    res.write(`
      <script src="/js/CharacterCount.js"></script>
      <script>
        var CharacterLimit = new CharacterCount({
          target: document.getElementById('character-count'),
          data: {
            remainingCharacters: 52
          }
        });
      </script>
    `)
    res.end();
  });

});

app.get(['/illustration', 'illustration.html'], (req, res) => {
  const { html, head, css } = illustrationSubmissionView.render();
  // And I guess this is how express returns the page?
  res.write(head);
  res.write('<style>' + css.code + '</style>');
  res.write(html);
  res.end();
});

app.get('/complete', (req, res) => {
  const { html, head, css } = completeView.render();
  // And I guess this is how express returns the page?
 res.set({ 'content-type': 'text/html; charset=utf-8' });
  res.write(head);
  res.write('<style>' + css.code + '</style>');
  res.write(html);
  res.end();
});
