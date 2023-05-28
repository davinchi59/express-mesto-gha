const { celebrate } = require('celebrate');
const Joi = require('joi');

module.exports = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
