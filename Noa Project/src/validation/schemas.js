const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(50).required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const cardSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  content: Joi.string().allow("").max(500),
});

module.exports = {
  registerSchema,
  loginSchema,
  cardSchema,
};
