const isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in.')
    return res.redirect('/login') // must return or next() will not run
  }
  next();
};

module.exports = isLoggedIn;

