// List of schemas that we want Joi to validate

const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required(),
  body: Joi.string().required(),
});