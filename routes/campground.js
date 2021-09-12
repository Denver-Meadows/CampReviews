// If not in production -- get access to the .env variables
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};

const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware/middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary')
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage }) // tell multer where to store the files which is the new storage we created with multer/cloudinary

// Usering router.route to chain commands on a specific route (refactoring all routes)
router.route('/')
  .get(catchAsync(campgrounds.index)) // index
  //.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) // 2nd Part of Create (posting data from form)
  .post(upload.array('image'), (req, res) => {
    console.log(req.body, req.files);
    res.send('It worked')
  })
// Create
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground)) // Show
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // Delete
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)) // Put for 2nd part of edit -- isLoggenIn gives us access to req.user

// Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;