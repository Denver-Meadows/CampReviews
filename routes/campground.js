const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware/middleware');
const campgrounds = require('../controllers/campgrounds');

// Usering router.route to chain commands on a specific route (refactoring all routes)
router.route('/')
  .get(catchAsync(campgrounds.index)) // index
  .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) // 2nd Part of Create (posting data from form)

// Create
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground)) // Show
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // Delete
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)) // Put for 2nd part of edit -- isLoggenIn gives us access to req.user

// Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;