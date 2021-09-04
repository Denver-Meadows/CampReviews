const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground'); // import models
const ExpressError = require('../utilities/ExpressError');
const { campgroundSchema } = require('../schemas.js'); // Destructuring here, we can call campgroundSchema below in the validate function.

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

// Index
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

// Create
router.get('/new', (req, res) => {
  res.render('campgrounds/new')
})

// 2nd Part of Create (posting data from form)
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
  const campground = new Campground(req.body)
  await campground.save();
  res.redirect(`campgrounds/${campground._id}`)
}))

// Show
router.get('/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate('reviews')  // need to populate in order for the reviews to show the detail instaed of an ObjectId
  res.render('campgrounds/show', { campground })
}));

// Edit
router.get('/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render(`campgrounds/edit`, { campground })
}));

// Delete 2 
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

// Put for 2nd part of edit 
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body}, {useFindAndModify: false}) // pass in the id and then spread the req.body object into the new object
  res.redirect(`/campgrounds/${campground._id}`)
}))

module.exports = router;