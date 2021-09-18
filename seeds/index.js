// To seed the DB we want this file to be self-contained (connected to Mongoose and use the Model)
// Reminder:  We always run this file separate, without node, whenever we want to seed our DB.

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

const mongoose = require("mongoose");
const Campground = require("../models/campground"); // import model
mongoose.connect("mongodb://localhost:27017/camp-review", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Mongoose Connection error handling
mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

// Get random number from array -- Will use function below
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// Delete everything from DB (do a test prior to seeding to make sure we are connected to the DB).  Anytime you run this file, it will delete the DB and seed it with 50 random places
const seedDB = async () => {
  await Campground.deleteMany({}); // delete everything
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      author: "613946e9ca50147b79ff2e75",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`, // creating made up names
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto voluptatibus debitis vel officiis ab, ratione quis, reprehenderit repudiandae tempora nulla animi totam nemo iure corporis beatae rerum quibusdam modi esse?",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dfsqn3oi6/image/upload/v1631662661/CampReviews/drr0a7vidhqzigsdgehe.jpg",
          filename: "CampReviews/drr0a7vidhqzigsdgehe",
        },
        {
          url: "https://res.cloudinary.com/dfsqn3oi6/image/upload/v1631662661/CampReviews/jbr6pf4qknszaeezd8oh.jpg",
          filename: "CampReviews/jbr6pf4qknszaeezd8oh",
        },
      ],
    });
    await camp.save();
  }
};

// Close the DB connection after calling seedDB
seedDB().then(() => {
  mongoose.connection.close();
});
