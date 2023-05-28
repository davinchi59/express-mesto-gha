const { celebrate } = require('celebrate');
const Joi = require('joi');

module.exports = celebrate({
  params: Joi.object().keys({
    userId: Joi.objectId(),
  }),
});
