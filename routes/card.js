const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getCards,
  createCard,
  removeCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/card');
const { UrlRegExp } = require('../utils/constants');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(UrlRegExp).required(),
    }),
  }),
  createCard,
);
router.delete('/:cardId', removeCard);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.objectId().required(),
    }),
  }),
  addCardLike,
);
router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.objectId().required(),
    }),
  }),
  removeCardLike,
);

module.exports = router;
