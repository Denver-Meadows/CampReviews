const Campground = require('../models/campground'); // import models

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
};

// We now have access to req.body from multer and req.files.
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body)
  campground.images = req.files.map(f => ({url: f.path, filename: f.filename})) // map over the array that is returned, add the url and filename for our model
  // Since we are checking if someone is logged in and we have access to req.user thanks to passport, we can take the user_id and save it as the user on the campground
  campground.author = req.user._id;  // author in our schema is an objectId, therefore we can set the id to the req.user_id
  await campground.save();
  req.flash('success', 'Successfully made a new campground!')
  res.redirect(`campgrounds/${campground._id}`)
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id).populate({ // nested populate -- populate the reviews, then populate the author of that review
    path: 'reviews',
    populate: {
      path: 'author',
    }
  }).populate('author')  // populate the author of the campground.
  // If we can't find a campground, flash the error and redirect.
  if (!campground) {
    req.flash('error', 'Cannot find that Campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show', { campground })
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if (!campground) {
    req.flash('error', 'Cannot find that campground!')
    return res.redirect('/campgrounds')
  }
  res.render(`campgrounds/edit`, { campground })
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id)
  req.flash('success', 'Successfully deleted campground!')
  res.redirect('/campgrounds')
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  // pass in the id and then spread the req.body object into the new object
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body })
  req.flash('success', 'Successfully updated campground!')
  res.redirect(`/campgrounds/${campground._id}`)
};