const Campground = require('../models/campground'); // import models
const { campgroundSchema } = require('../schemas.js'); // Destructuring here, we can call campgroundSchema below in the validate function.
const ExpressError = require('../utilities/ExpressError');
const { reviewSchema } = require('../schemas.js'); // Destructuring here, we can call reviewSchema below in the validate function.

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl //originalUrl is added by passport.  Keeps track of where the user was and we are adding that to the session. Adding this to the login
    req.flash('error', 'You must be signed in.')
    return res.redirect('/login') // must return or next() will not run
  }
  next();
};

// Creating a middleware function to validate Campground with Joi.
module.exports.validateCampground = (req, res, next) => {
  // Saving the result of the validation and passing an error if something is wrong
  const result = campgroundSchema.validate(req.body)
  if (result.error) { 
    const msg = result.error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
};

// Checks if the signed in User is the author and then allows them to update campground
module.exports.isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that.')
    return res.redirect(`/campgrounds/${id}`)
  } else {
    next();
  }
};

// Creating middleware function to validate Review with Joi -- reviews.js
module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
};