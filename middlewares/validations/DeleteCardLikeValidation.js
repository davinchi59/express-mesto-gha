const { celebrate } = require('celebrate');
const Joi = require('joi');

module.exports = celebrate({
  params: Joi.object().keys({
    cardId: Joi.objectId().required(),
  }),
});
