const Joi = require('joi');

// Validation schemas
const createBikeSchema = Joi.object({
  brand: Joi.string().trim().min(1).max(100).required(),
  model: Joi.string().trim().min(1).max(100).required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required(),
  price: Joi.number().positive().max(1000000).required(),
  kilometers_driven: Joi.number().min(0).max(1000000).required(),
  location: Joi.string().trim().min(1).max(200).required(),
  imageUrl: Joi.string().uri().trim().required()
});

const updateBikeSchema = Joi.object({
  brand: Joi.string().trim().min(1).max(100),
  model: Joi.string().trim().min(1).max(100),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
  price: Joi.number().positive().max(1000000),
  kilometers_driven: Joi.number().min(0).max(1000000),
  location: Joi.string().trim().min(1).max(200),
  imageUrl: Joi.string().uri().trim()
});

const querySchema = Joi.object({
  brand: Joi.string().trim().min(1).max(100),
  model: Joi.string().trim().min(1).max(100)
});

// Validation middleware functions
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({ 
        message: 'Query validation error', 
        details: error.details.map(detail => detail.message) 
      });
    }
    next();
  };
};

module.exports = {
  validate,
  validateQuery,
  createBikeSchema,
  updateBikeSchema,
  querySchema
};
