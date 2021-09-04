const express = require('express');
const router = express.Router( {mergeParams: true }); // In order to get access to all req.params, we need to pass in the option mergeParams.
const catchAsync = require('../utilities/catchAsync');
const Review = require('../models/review'); // import models
const Campground = require('../models/campground'); // import models
const ExpressError = require('../utilities/ExpressError');
const { reviewSchema } = require('../schemas.js'); // Destructuring here, we can call reviewSchema below in the validate function.

// Creating middleware function to validate Review with Joi.
const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
};

// Create reviews
router.post('/', validateReview, catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id); // Find corresponding campground for this review
  const review = new Review(req.body) // Using the Review model to create a new review by passing in the body of the form
  campground.reviews.push(review); // We got the campground above, now we can push this new review into the "Reviews" array which all campgrounds have
  await review.save(); // save the review -- This can be done in a parallel way with the campground review below.
  await campground.save();
  req.flash('success', 'Created new review!')
  res.redirect(`/campgrounds/${campground._id}`); // redirect back to the campground show page
}))

// Delete reviews
// For this route, we will need the campground id and then the review id so we can delete the review from that campground on the db
// Will need a delete form on the show page
router.delete('/:reviewId', catchAsync(async(req, res) => {
  const { id, reviewId } = req.params
  // Pull operator in mongoose removes from an existing array all instatnces of a value that match a specified condition
  await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId} }); // we find the campground by the id and then "pull" the reviewId from the reviews
  await Review.findByIdAndDelete(req.params.reviewId); // Also delete the review from the reviews db
  req.flash('success', 'Successfully deleted review!')
  res.redirect(`/campgrounds/${id}`); // send back to campground show page
}));

module.exports = router;