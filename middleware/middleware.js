const isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl //originalUrl is added by passport.  Keeps track of where the user was and we are adding that to the session. Adding this to the login
    req.flash('error', 'You must be signed in.')
    return res.redirect('/login') // must return or next() will not run
  }
  next();
};

module.exports = isLoggedIn;

