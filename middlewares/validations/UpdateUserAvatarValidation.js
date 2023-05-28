const { celebrate } = require('celebrate');
const Joi = require('joi');
const { UrlRegExp } = require('../../utils/constants');

module.exports = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(UrlRegExp),
  }),
});
