const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // shortcut for mongoose.Schema

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema)  // export created model