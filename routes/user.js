const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserProfile,
  getUserById,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.get('/me', getUser);
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
