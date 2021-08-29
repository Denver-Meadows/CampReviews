const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Importing catchAsync
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');

// ejs-mate is an add-on for ejs that helps make designing views easy.  We can create a boilerplate that is shared across all pages.
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');

const mongoose = require('mongoose');
const Campground = require('./models/campground'); // import model
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate); // Tell the app we are using ejsMate as the engine that runs, parse's and basically makes sense of EJS instead of the default. With this we can define a layout file.
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method')) // pass in query string we want to use

app.get('/', (req, res) => {
  res.render('home')
});

// Index
app.get('/campgrounds', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
}))

// Create
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

// 2nd Part of Create (posting data from form)
app.post('/campgrounds', catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body)
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`)
}))

// Show
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render('campgrounds/show', { campground })
}));

// Edit
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id)
  res.render(`campgrounds/edit`, { campground })
}));

// Delete
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

// Put for 2nd part of edit
app.put('/campgrounds/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body}, {useFindAndModify: false}) // pass in the id and then spread the req.body object into the new object
  res.redirect(`/campgrounds/${campground._id}`)
}))

// Using all for all types of requests and * for all paths, if not found send 404 alert
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

// basic error handling
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  console.log(err)
  res.status(statusCode).render('error', { err }); // passing in the entire error
})

app.listen(port, () => {
  console.log('Listening on 3000')
})