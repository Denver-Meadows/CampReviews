const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema ({
  eamil: {
    type: String,
    required: true,
    unique: true,
  }
});

// We did not specify username and password above.
// Instead we use the below pulgin method and pass in the above required passportLocalMongoose.
// This will add a username to our schema which must be unique and also add a password field.
// This includes a hash and slat field to store the username and the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)