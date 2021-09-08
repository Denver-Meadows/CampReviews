const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const User = require('./models/user') // importing User Model

const campgroundRoutes = require('./routes/campground'); // Require routes (will need to add the app.use below to init)
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user')

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportStrategy = require('passport-local');

// Importing catchAsync
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');

// ejs-mate is an add-on for ejs that helps make designing views easy.  We can create a boilerplate that is shared across all pages.
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/camp-review', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// Mongoose Connection error handling
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuring session
const sessionConfig = {
  secret: 'willNeedToUpdateThisSecretForProduction',
  resave: false,
  saveUninitialized: true,
  // We can add some additional options for the cookie
  cookie: {
    httpOnly: true, // helps with security
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires in a week.  Date.now is in milliseconds so we need the match to convert
    maxAge: 1000 * 60 * 60 * 24 * 7, // maxAge is a week
  }
};
app.use(session(sessionConfig))
app.use(flash());

app.engine('ejs', ejsMate); // Tell the app we are using ejsMate as the engine that runs, parse's and basically makes sense of EJS instead of the default. With this we can define a layout file.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method')) // pass in query string we want to use
app.use(express.static(path.join(__dirname, 'public')));

// PASSPORT
app.use(passport.initialize()); 
app.use(passport.session()); // Needed if we want persisent login with passport.  Must be used AFTER session
// Now we must tell passport to use the passportStrategy we required and for that passportStrategy, the authentication method will be on the User model.
// authenticate is a method from created by passport.
passport.use(new passportStrategy(User.authenticate()));

// Tells passport how we serialize a User -- which is how we store the user in the session.
// Again - these methods are created by passport.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); // opposite of above.  How to remove the user from the session.

// middleware for flash
app.use((req, res, next) => {
  res.locals.success = req.flash('success'); // with this, we'll have access to 'success' variable on all requests.
  res.locals.error = req.flash('error');
  next();
})

// Init routes
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
  res.render('home')
});

// Using all for all types of requests and * for all paths, if not found send 404 alert
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// basic error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err }); // passing in the entire error
})

app.listen(port, () => {
  console.log('Listening on 3000')
})