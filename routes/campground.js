const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware/middleware');
const campgrounds = require('../controllers/campgrounds');

// Index
router.get('/', catchAsync(campgrounds.index))

// Create
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// 2nd Part of Create (posting data from form)
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

// Show
router.get('/:id', catchAsync(campgrounds.showCampground));

// Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// Put for 2nd part of edit -- isLoggenIn gives us access to req.user
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

module.exports = router;