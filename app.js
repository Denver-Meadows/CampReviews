const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const campgrounds = require('./routes/campground'); // Require routes (will need to add the app.use below to init)
const reviews = require('./routes/reviews');

const session = require('express-session');

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

app.engine('ejs', ejsMate); // Tell the app we are using ejsMate as the engine that runs, parse's and basically makes sense of EJS instead of the default. With this we can define a layout file.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method')) // pass in query string we want to use
app.use(express.static(path.join(__dirname, 'public')));

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

// Init routes
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

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