const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;  // shortcut for mongoose.Schema

const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  // needs to store and array of images with cloudinary
//   images: [
//     {
//       url: String,
//       filename: String,
//   }
// ],
  image: {
    type: String,

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
  author: {
    // will be a ref so we need ObjectId so we can reference the other Model in the db. (populate will show this info)
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId, // this is an ObjectID
      ref: "Review", // The reference model
    }
  ],
});

// Mongoose middleware for deleting.  Post will run after 'findOneAndDelete' runs. Which is being ran when we delete a campground with 'findByIdAndDelete'.  Check the mongoose docs but this is their middleware that runs.
CampgroundSchema.post('findOneAndDelete', async function (doc) {
  // console.log(doc) // the doc is the data that was deleted.
  // If there is a doc, remove the id's that are in the reviews array.
  if (doc) {
    await review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema)  // export created model