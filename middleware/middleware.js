const isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in.')
    return res.redirect('/login') // must return or otherwise the below code will run.
  }
  next();
};

module.exports = isLoggedIn;

