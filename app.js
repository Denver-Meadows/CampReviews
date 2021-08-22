const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const mongoose = require('mongoose');
const Campground = require('./models/campground'); // import model
mongoose.connect('mongodb://localhost:27017/camp-review', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Mongoose Connection error handling
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('home')
})

// For testing
app.get('/makecampground', async (req, res) => {
  const camp = new Campground({ title: 'My Backyard', description: 'Cheap Camping'})
  await camp.save();
  res.send(camp)
})

app.listen(port, () => {
  console.log('Listening on 3000')
})