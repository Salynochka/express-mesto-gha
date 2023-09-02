const router = require('express').Router();
const {
  getUsers, getUserId, getCurrentUser, updateUser, changeAvatar,
} = require('../controllers/users');

const {
  // validateUser,
  validateUserId,
  validateUpdateUser,
  validateChangeAvatar,
} = require('../middlewares/validate');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', validateUserId, getUserId);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateChangeAvatar, changeAvatar);

module.exports = router;
