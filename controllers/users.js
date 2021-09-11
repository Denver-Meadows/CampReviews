const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register')
};

// Adding a try/catch in addition to the catchAsync
module.exports.registerNewUser = async (req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login')
};

// Passport gives us additional middleware we can use to authenticate. This methods requires the strategy and options we can specify.
// The options will flash a message a failure and redirect to login
module.exports.loginUser = (req, res) => {
  req.flash('success', 'Welcome back!');
  // We want to redirect to where the user was trying to go to.
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo; // deletes any reminants of the returnTo object on the session
  res.redirect(redirectUrl)
};

module.exports.logoutUser = (req, res) => {
  req.logOut();
  req.flash('success', 'You have logged out.')
  res.redirect('/campgrounds')
};