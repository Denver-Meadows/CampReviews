const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/user')

// Route to create new user (render form)

router.get('/register', (req, res) => {
  res.render('users/register')
})

// Post route to post data from form
// Adding a try/catch in addition to the catchAsync
router.post('/register', catchAsync(async (req, res) => {
  try {
      const {email, username, password} = req.body;
      const user = new User({email, username})   // create new user instance but do not pass in the password.
      const registeredUser = await User.register(user, password); // The register method will register a new user with a given pw.  Checks if username is unique. It will handle all of the hashing and salt with the pw it stores. 
      console.log(registeredUser)
      req.flash('success', 'Welcome to YelpCamp')
      res.redirect('/campgrounds')
  } catch(e) {
      req.flash('error', e.message) // if this dosen't work, flash the built in e.message
      res.redirect('register')
  }
}));

// routes for loggin in
// router.get('')


module.exports = router;