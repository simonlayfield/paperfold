
let state = {
  db: null
};

const MongoClient = require('mongodb').MongoClient;

exports.connect = (url, done) => {

  if (state.db) return done();

  MongoClient.connect(url, { useNewUrlParser: true }).then((client) => {
    state.db = client.db('pictory');
    done();
  }).catch((err) => {
    console.log(err);
  });

}

exports.get = () => {
  return state.db;
}

exports.close = (done) => {
  if (state.db) {
    state.db.close((err, result) => {
      state.db = null;
      state.mode = null;
      done(err);
    });
  }
}
