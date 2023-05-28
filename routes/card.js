const router = require('express').Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getCards,
  createCard,
  removeCard,
  addCardLike,
  removeCardLike,
} = require('../controllers/card');
const AddCardLikeValidation = require('../middlewares/validations/AddCardLikeValidation');
const CreateCardValidation = require('../middlewares/validations/CreateCardValidation');
const DeleteCardValidation = require('../middlewares/validations/DeleteCardValidation');
const DeleteCardLikeValidation = require('../middlewares/validations/DeleteCardLikeValidation');

router.get('/', getCards);
router.post(
  '/',
  CreateCardValidation,
  createCard,
);
router.delete(
  '/:cardId',
  DeleteCardValidation,
  removeCard,
);
router.put(
  '/:cardId/likes',
  AddCardLikeValidation,
  addCardLike,
);
router.delete(
  '/:cardId/likes',
  DeleteCardLikeValidation,
  removeCardLike,
);

module.exports = router;
