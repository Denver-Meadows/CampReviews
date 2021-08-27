const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // shortcut for mongoose.Schema

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema)  // export created model