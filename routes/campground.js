const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground'); // import models
const ExpressError = require('../utilities/ExpressError');
const { campgroundSchema } = require('../schemas.js'); // Destructuring here, we can call campgroundSchema below in the validate function.
const isLoggedIn = require('../middleware/middleware')

// Creating a middleware function to validate Campground with Joi.
const validateCampground = (req, res, next) => {
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
const isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that.')
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

// Index
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

// Create
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

// 2nd Part of Create (posting data from form)
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body)
  // Since we are checking if someone is logged in and we have access to req.user thanks to passport, we can take the user_id and save it as the user on the campground
  campground.author = req.user._id;  // author in our schema is an objectId, therefore we can set the id to the req.user_id
  await campground.save();
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`campgrounds/${campground._id}`)
}))

// Show
router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews').populate('author')  // need to populate in order for the reviews to show the detail instaed of an ObjectId
  // If we can't find a campground, flash the error and redirect.
  if (!campground) {
    req.flash('error', 'Cannot find that Campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground })
}));

// Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  res.render(`campgrounds/edit`, { campground })
}));

// Delete 2 
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted campground!')
  res.redirect('/campgrounds')
}))

// Put for 2nd part of edit -- isLoggenIn gives us access to req.user
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  // pass in the id and then spread the req.body object into the new object
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
  req.flash('success', 'Successfully updated campground!')
  res.redirect(`/campgrounds/${campground._id}`)
}))

module.exports = router;