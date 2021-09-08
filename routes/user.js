const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const User = require('../models/user');
const passport = require('passport');

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
      // console.log(registeredUser)
      // the req.login function requires a callback so we can't await it.
      req.login(registeredUser, err => {
        if(err) return next(err) // hit error handler
        req.flash('success', 'Welcome to YelpCamp')
        res.redirect('/campgrounds')
      })
  } catch(e) {
      req.flash('error', e.message) // if this dosen't work, flash the built in e.message
      res.redirect('register')
  }
}));

// routes for logging in
router.get('/login', (req, res) => {
  res.render('users/login')
});

// Post route for login.  
// Passport gives us additional middleware we can use to authenticate. This methods requires the strategy and options we can specify.
// The options will flash a message a failure and redirect to login
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
  req.flash('success', 'Welcome back!');
  res.redirect('/campgrounds')
})

// route to logout.  Passport gives us access to a logout method on the req object, which logs out the user.
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success', 'You have logged out.')
  res.redirect('/campgrounds')
})


module.exports = router;