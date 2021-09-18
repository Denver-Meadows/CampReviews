// List of schemas that we want Joi to validate

const baseJoi = require("joi"); // Standard Joi -- Below we will pass in an extension for baseJoi.
const sanitizeHtml = require("sanitize-html");

// Making an extension to safeguard aganist XSS
// We are making a function called validate, which Joi will checked based on whatever value it receives.
// Also using sanitize-html
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = baseJoi.extend(extension); // The extension was added later so we are naming it Joi so we don't have to update the below code.

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),
  price: Joi.number().required().min(0),
  location: Joi.string().required().escapeHTML(),
  // image: Joi.string().required(),
  description: Joi.string().required().escapeHTML(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required(),
  body: Joi.string().required().escapeHTML(),
});
