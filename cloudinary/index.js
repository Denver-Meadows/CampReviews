const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Set the config on cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Setting up an instance
const storage = new CloudinaryStorage({
  cloudinary, // passing in above cloudinary.config
  params: {
    folder: 'CampReviews', // folder in cloudinary to store this data
    allowedFormats: ['jpeg', 'png', 'jpg']
  }
});
 
module.exports = {
  cloudinary, 
  storage
}