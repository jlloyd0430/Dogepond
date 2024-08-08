const express = require('express');
const request = require('request');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.use('/', (req, res) => {
  const url = 'https://wet-games-joke.loca.lt' + req.url;
  req.pipe(request({ qs: req.query, uri: url })).pipe(res);
});

app.listen(8080, () => {
  console.log('CORS proxy running on port 8080');
});
