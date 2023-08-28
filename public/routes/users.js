const router = require('express').Router();
const {
  getUsers, getUserId, getCurrentUser, updateUser, changeAvatar,
} = require('../controllers/users');

const {
  validateUser,
  validateUserId,
} = require('../middlewares/validate');

router.get('/', validateUser, getUsers);
router.get('/:userId', validateUserId, getUserId);
router.get('/me', validateUser, getCurrentUser);
router.patch('/me', validateUser, updateUser);
router.patch('/me/avatar', validateUser, changeAvatar);

module.exports = router;
