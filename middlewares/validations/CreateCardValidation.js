const { celebrate } = require('celebrate');
const Joi = require('joi');
const { UrlRegExp } = require('../../utils/constants');

module.exports = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(UrlRegExp).required(),
  }),
});
