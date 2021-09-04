const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

const campgrounds = require('./routes/campground'); // Require routes (will need to add the app.use below to init)

// Destructuring here, we can call campgroundSchema below in the validate function.
const { campgroundSchema, reviewSchema } = require('./schemas.js');

// Importing catchAsync
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');

// ejs-mate is an add-on for ejs that helps make designing views easy.  We can create a boilerplate that is shared across all pages.
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');

// import models
const Campground = require('./models/campground'); 
const Review = require('./models/review');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/camp-review', {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Mongoose Connection error handling
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
  console.log("Database connected");
});


// Creating middleware function to validate Review with Joi.
const validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body)
  if (result.error) {
    const msg = result.error.details.map(el => el.message).join(', ')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate); // Tell the app we are using ejsMate as the engine that runs, parse's and basically makes sense of EJS instead of the default. With this we can define a layout file.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method')) // pass in query string we want to use

app.get('/', (req, res) => {
  res.render('home')
});

// Init routes
app.use('/campgrounds', campgrounds)


// Create reviews
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res) => {
  const campground = await Campground.findById(req.params.id); // Find corresponding campground for this review
  const review = new Review(req.body) // Using the Review model to create a new review by passing in the body of the form
  campground.reviews.push(review); // We got the campground above, now we can push this new review into the "Reviews" array which all campgrounds have
  await review.save(); // save the review -- This can be done in a parallel way with the campground review below.
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`); // redirect back to the campground show page
}))

// Delete reviews
// For this route, we will need the campground id and then the review id so we can delete the review from that campground on the db
// Will need a delete form on the show page
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req, res) => {
  const { id, reviewId } = req.params
  // Pull operator in mongoose removes from an existing array all instatnces of a value that match a specified condition
  await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewId} }); // we find the campground by the id and then "pull" the reviewId from the reviews
  await Review.findByIdAndDelete(req.params.reviewId); // Also delete the review from the reviews db
  res.redirect(`/campgrounds/${id}`); // send back to campground show page
}));

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