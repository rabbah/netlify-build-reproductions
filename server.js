const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', function (req, res) {
  res.json({ url: req.url, body: req.body, method: req.method });
});

app.listen(5000);
