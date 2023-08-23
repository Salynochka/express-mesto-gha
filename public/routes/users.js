const router = require('express').Router();
const { celebrate, Joi } = require('../../node_modules/celebrate');

const {
  getUsers, getUserId, getCurrentUser, updateUser, changeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string(),
  }),
}), getUserId);

router.get('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
  }),
}), updateUser);

const newLocal = /https?:\/\/\w{3}?\.\S[0,]*/;
const regex = newLocal;
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    // avatar: Joi.str.match(regex),
  }),
}), changeAvatar);

module.exports = router;
