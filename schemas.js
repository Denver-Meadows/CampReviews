// List of schemas that we want Joi to validate

const Joi = require("joi");

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
          return helpers.error("string.escapedHTML", { value });
        return clean;
      },
    },
  },
});

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  // image: Joi.string().required(),
  description: Joi.string().required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required(),
  body: Joi.string().required(),
});
