const router = require('express').Router();
const {
  getUsers, getUserId, createUser, updateUser, changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.patch('/me', updateUser);
router.patch('/me/avatar', changeAvatar);
router.post('/', createUser);

module.exports = router;
