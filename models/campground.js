const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // shortcut for mongoose.Schema

const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId, // this is an ObjectID
      ref: "Review", // The reference model
    }
  ],
});

module.exports = mongoose.model('Campground', CampgroundSchema)  // export created model