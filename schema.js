const Joi = require('joi');

const stringPattern = /^[A-Za-z _-]+$/; // Define a pattern for allowed characters in strings
const descPattern = /^[^\d\s].*/
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().min(5).max(100).pattern(stringPattern),
        description: Joi.string().required().min(10).max(500).pattern(descPattern),
        image: Joi.object().allow("", null),
        price: Joi.number().required().min(0),
        location: Joi.string().required().min(3).max(100).pattern(stringPattern),
        country: Joi.string().required().min(3).max(100).pattern(stringPattern),
        category: Joi.string().required().min(3).max(50).pattern(stringPattern)
    }).required()
}).options({ abortEarly: true });

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required().min(3).max(500).pattern(descPattern)   
    })
}).options({ abortEarly: true });

module.exports.userSchema = Joi.object({
    username: Joi.string().regex(/^[A-Za-z\s]+$/).min(3).max(50).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(8).required()
});


