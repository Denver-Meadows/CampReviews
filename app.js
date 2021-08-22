const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from CampReviews')
})

app.listen(port, () => {
  console.log('Listening on 3000')
})