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
      welcomeView = require('./src/components/views/welcome.svelte'),
      dashboardView = require('./src/components/views/dashboard.svelte'),
      tocView = require('./src/components/views/toc.svelte'),
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


// New idea! - single destination handler

function destinationHandler (req, res) {
  res.redirect(req.params.destination);
}

function chapterFormHandler (req, res, next) {

  if (req.body.storyField === "") {
    req.params = {
      formIsInvalid: true
    };
    return next();
  } else {
    req.params = {
      formIsInvalid: false
    };
  }

  let currentStoryId = new ObjectId(req.query.id),
      currentStoryData,
      currentProgress = req.body.storyProgress;

  db.collection('stories').find({"_id": currentStoryId}).toArray(function(err, results) {
    currentStoryData = results[0];

    currentStoryData.progress = parseInt(req.body.storyProgress) + 1;
    console.log('progress is ' + currentStoryData.progress);
    currentStoryData.chapters[currentProgress].text = req.body.storyField;

    const currentStoryTitle = currentStoryData.title;

    if(currentStoryData.progress < 3) {

      db.collection('stories').updateOne({
        "_id": currentStoryId
      },{
        $set: currentStoryData
      });

      req.params = { destination: '/toc?id=' + req.query.id };
      return next();

    } else {

      newChapterObj = Object.assign(currentStoryData, {
        "complete": true
      });

      db.collection('stories').updateOne({
        "_id": currentStoryId
      }, {
        $set: newChapterObj
      },
        function(err, result) {

          db.collection('users').updateMany({
              "username": "simon"
            }, {
              $pull: { "contributions": { "title": currentStoryTitle }},
              $push: { "complete": currentStoryData }
            }, {
              upsert: true
            },
            function(err, result) {
                req.params = { destination: '/complete' };
                return next();
            });
        }
      );


    }


  });
}

function storyFormHandler (req, res, next) {

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

      req.query.id = newStoryId;

      db.collection('users').updateOne(
          {
            "username": currentUser
          }, {
            $push: {
              "contributions": {
                "id": newStoryId,
                "title": req.body.title
              }
            }
          }, {
            upsert: true
          },
          function(err, result) {
              return next();
          }
        );
    });

  });

}

function tocCtrl (req, res) {

  const currentStoryId = new ObjectId(req.query.id);

  db.collection('stories').find({
    "_id": currentStoryId
  }).toArray(function(err, results) {
    if (err) return console.log(err);

    const { html, head, css } = tocView.render(null, {
      store: new Store({
        currentStoryData: results[0]
      })
    });

    res.set({ 'content-type': 'text/html; charset=utf-8' });
    res.write(head);
    res.write('<style>' + css.code + '</style>');
    res.write(html);
    res.end();
  });
}

function homeCtrl (req, res) {
  const { html, head, css } = welcomeView.render();
  res.set({ 'content-type': 'text/html; charset=utf-8' });
  res.write(head);
  res.write('<style>' + css.code + '</style>');
  res.write(html);
  res.end();
}

function dashboardCtrl (req, res) {

  db.collection('users').find({
    "username": "simon"
  }).toArray(function(err, results) {

    if (err) return console.log(err);

    const { html, head, css } = dashboardView.render(null, {
      store: new Store({
        currentUserData: results[0],
        formIsInvalid: req.params.formIsInvalid
      })
    });
    res.set({ 'content-type': 'text/html; charset=utf-8' });
    res.write(head);
    res.write('<style>' + css.code + '</style>');
    res.write(html);
    res.end();

  });

}

function storyCtrl (req, res) {

  const currentStoryId = new ObjectId(req.query.id);

  db.collection('stories').find({
    "_id": currentStoryId
  }).toArray(function(err, results) {
    if (err) return console.log(err);

    const { html, head, css } = storyView.render(null, {
      store: new Store({
        currentStoryData: results[0]
      })
    });

    res.set({ 'content-type': 'text/html; charset=utf-8' });
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
    `);
    res.end();
  });

}

// User Submissions
app.post('/addChapterText', chapterFormHandler, destinationHandler);

app.post('/addStory', storyFormHandler, tocCtrl);


// Application Pages
app.get(['/', '/index.html'], homeCtrl);

app.get('/dashboard', dashboardCtrl);

app.get('/toc', tocCtrl);

app.get(['/story', 'story.html'], storyCtrl);

app.get(['/illustration', 'illustration.html'], (req, res) => {
  const { html, head, css } = illustrationSubmissionView.render();
  res.set({ 'content-type': 'text/html; charset=utf-8' });
  res.write(head);
  res.write('<style>' + css.code + '</style>');
  res.write(html);
  res.end();
});

app.get('/complete', (req, res) => {
  const { html, head, css } = completeView.render();
  res.set({ 'content-type': 'text/html; charset=utf-8' });
  res.write(head);
  res.write('<style>' + css.code + '</style>');
  res.write(html);
  res.end();
});
