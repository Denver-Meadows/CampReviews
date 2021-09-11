const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// We need to connect a review to a campground so this will be a one to many.
// In order to do so, we are going to store an array or ObjectId's reviews in each campground.
const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});

module.exports = mongoose.model('Review', reviewSchema)