const router = require('express').Router();

const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

const {
  validateCard,
  validateCardId,
} = require('../middlewares/validate');

router.get('/', getCards);
router.post('/', validateCard, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, addLike);
router.delete('/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
