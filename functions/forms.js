module.exports = {
  storyFormHandler: function (req, res, next) {

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
}
