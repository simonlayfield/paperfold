const db = require('../db'),
      ObjectId = require('mongodb').ObjectId;

const deleteStoryRequest = (req) => {

  console.log(req.params.id);

  return new Promise((resolve, reject) => {

    db.get().collection('stories').deleteOne({_id: ObjectId(req.params.id)});
    resolve();

  }).catch((err) => console.log(err));
}

var callDeleteStoryRequest = async (req) => {
  let result = await (deleteStoryRequest(req));
  return result;
}

const updateStoryRequest = (req) => {

    return new Promise((resolve, reject) => {
      db.get().collection('stories').updateOne({_id: ObjectId(req.body.storyId)},
      {
        $set: {
          "title": req.body.storyTitle
        }
      },
      {
        upsert: true
      },
      function(err, result) {
        if(err) console.log(err);
        resolve();
      }
    )
    }).catch((err) => console.log(err));

}

const callUpdateStoryTitleRequest = async (req) => {
  let result = await (updateStoryRequest(req));
  return result;
}


exports.deleteStory = (req, cb) => {
  callDeleteStoryRequest(req).then(() => {
    cb();
  })
}

exports.updateStoryTitle = (req, cb) => {
  callUpdateStoryTitleRequest(req).then(() => {
    cb();
  });
}
