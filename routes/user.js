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
router.patch('/me', updateUserProfile);
router.patch(
  '/me/avatar',
  (req, res, next) => {
    req.body = { avatar: req.body.avatar };
    next();
  },
  updateUserProfile,
);

module.exports = router;
