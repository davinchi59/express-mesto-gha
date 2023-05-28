const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getUsers,
  getUser,
  updateUserProfile,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/me', getUser);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.objectId(),
    }),
  }),
  getUser,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserProfile,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/^https?:\/\/(wwq\.)?[a-z0-9\-._~:/?#[\]@!$&'()*+,;=]{1,}#?$/i),
    }),
  }),
  (req, res, next) => {
    req.body = { avatar: req.body.avatar };
    next();
  },
  updateUserProfile,
);

module.exports = router;
