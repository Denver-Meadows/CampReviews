const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const passport = require('passport');
const users = require('../controllers/users')

// Route to create new user (render form)
router.get('/register', users.renderRegisterForm)

// Post route to post data from form
router.post('/register', catchAsync(users.registerNewUser));

// routes for logging in
router.get('/login', users.renderLoginForm);

// Post route for login.  
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.loginUser)

// route to logout.  Passport gives us access to a logout method on the req object, which logs out the user.
router.get('/logout', users.logoutUser)

module.exports = router;