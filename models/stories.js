const db = require('../db');

const getStoriesByAuthorRequest = () => {
  return new Promise((resolve, reject) => {
    db.get().collection('stories').find({
      "author": "simon"
    }).toArray(function(err, results) {

      if (err) {
        reject(err)
      } else {
        resolve(results);
      }

    });
  }).catch((err) => console.log(err));
}

var callGetStoriesByAuthorRequest = async () => {
  var result = await (getStoriesByAuthorRequest());
  return result;
}

exports.getStoriesByAuthor = (cb) => {
  callGetStoriesByAuthorRequest().then((result) => {
    cb(result);
  })
}
