const router = require('express').Router();
const {
  getUsers, getUserId, getCurrentUser, updateUser, changeAvatar,
} = require('../controllers/users');

const {
  validateUser,
  validateUserId,
} = require('../middlewares/validate');

router.get('/users', getUsers);
router.get('/users/:userId', validateUserId, getUserId);
router.get('/users/me', getCurrentUser);
router.patch('users/me', validateUser, updateUser);
router.patch('users/me/avatar', validateUser, changeAvatar);

module.exports = router;
