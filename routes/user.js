const router = require('express').Router();
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {
  getUsers,
  getUser,
  updateUserProfile,
} = require('../controllers/user');
const GetUserValidation = require('../middlewares/validations/GetUserValidation');
const UpdateUserAvatarValidation = require('../middlewares/validations/UpdateUserAvatarValidation');
const UpdateUserValidation = require('../middlewares/validations/UpdateUserValidation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get(
  '/:userId',
  GetUserValidation,
  getUser,
);
router.patch(
  '/me',
  UpdateUserValidation,
  updateUserProfile,
);
router.patch(
  '/me/avatar',
  UpdateUserAvatarValidation,
  (req, res, next) => {
    req.body = { avatar: req.body.avatar };
    next();
  },
  updateUserProfile,
);

module.exports = router;
