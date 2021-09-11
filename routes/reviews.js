const express = require('express');
const router = express.Router( {mergeParams: true }); // In order to get access to all req.params, we need to pass in the option mergeParams.
const catchAsync = require('../utilities/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware/middleware');
const reviews = require('../controllers/reviews')

// Create reviews
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

// Delete reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;