const router = require('express').Router();
const {
  getUsers, getUserId, getCurrentUser, updateUser, changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.get('/me', getCurrentUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', changeAvatar);

module.exports = router;
