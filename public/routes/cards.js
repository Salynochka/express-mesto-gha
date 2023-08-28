const router = require('express').Router();

const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

const {
  validateCard,
} = require('../middlewares/validate');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCard, deleteCard);
router.put('/:cardId/likes', validateCard, addLike);
router.delete('/:cardId/likes', validateCard, deleteLike);

module.exports = router;
