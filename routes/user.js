const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const passport = require('passport');
const users = require('../controllers/users');
const { route } = require('./campground');

// Chaining routes with router.route
router.route('/register')
  .get(users.renderRegisterForm) // Route to create new user (render form)
  .post(catchAsync(users.registerNewUser)) // Post route to post data from form

router.route('/login')
  .get(users.renderLoginForm) // routes for logging in
  .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser) // Post route for login.  

// route to logout.  Passport gives us access to a logout method on the req object, which logs out the user.
router.get('/logout', users.logoutUser)

module.exports = router;