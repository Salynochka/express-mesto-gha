const router = require('express').Router();
const { celebrate, Joi } = require('../../node_modules/celebrate');

const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

router.get('/', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().min(2).max(30),
  }),
}), getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    _id: Joi.string().required().min(2),
  }),
}), createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
