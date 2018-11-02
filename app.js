const express = require('express'),
      app = express();

app.use(express.static('public'));

app.get(['/', 'index.html'], (req, res) => {
  res.sendFile(__dirname + 'index.html');
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
