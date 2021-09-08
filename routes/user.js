const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/user')

// Route to create new user (render form)

router.get('/', (req, res) => {
  res.render('users/register')
})

// Post route to post data from form
router.post('/', catchAsync(async (req, res) => {
  const {email, username, password} = req.body;
  const user = new User({email, username})   // create new user instance but do not pass in the password.
  const registeredUser = await User.register(user, password); // The register method will register a new user with a given pw.  Checks if username is unique. It will handle all of the hashing and salt with the pw it stores. 
  console.log(registeredUser)
  req.flash('success', 'Welcome to YelpCamp')
  res.redirect('/campgrounds')
}))


module.exports = router;