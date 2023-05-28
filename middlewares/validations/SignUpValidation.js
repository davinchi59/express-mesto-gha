const { celebrate } = require('celebrate');
const Joi = require('joi');
const { UrlRegExp } = require('../../utils/constants');

module.exports = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(UrlRegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
