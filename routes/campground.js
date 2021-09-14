// If not in production -- get access to the .env variables
if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
};
require("dotenv").config();

const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware/middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer'); // adds a req.body which contains values and req.file which contains files.
const { storage } = require('../cloudinary');
const upload = multer({ storage }); // tell multer where to store the files which is the new storage we created with multer/cloudinary

// Usering router.route to chain commands on a specific route (refactoring all routes)
router.route('/')
  .get(catchAsync(campgrounds.index)) // index
  .post(upload.single('images'), (req, res) => {
    res.send('working')
    console.log(req.file)
    console.log(req.body)
  })
  
  // .post(isLoggedIn, validateCampground ,catchAsync(campgrounds.createCampground)) // 2nd Part of Create (posting data from form)

// Create upload.array('image'),
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
  .get(catchAsync(campgrounds.showCampground)) // Show
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) // Delete
  .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground)) // Put for 2nd part of edit -- isLoggenIn gives us access to req.user

// Edit
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;