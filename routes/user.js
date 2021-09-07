const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/user')

// Route to create new user (render form)
// The register method will register a new user with a given pw.  Checks if username is unique.
// It will handle all of the hashing and salt with the pw it stores. 
router.get('/', (req, res) => {
  res.render('users/register')
})


module.exports = router;