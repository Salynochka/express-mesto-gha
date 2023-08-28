const router = require('express').Router();

const {
  getCards, createCard, deleteCard, addLike, deleteLike,
} = require('../controllers/cards');

const {
  validateCard,
  validateCardId,
} = require('../middlewares/validate');

router.get('/cards', getCards);
router.post('/cards', validateCard, createCard);
router.delete('/cards/:cardId', validateCardId, deleteCard);
router.put('/cards/:cardId/likes', validateCardId, addLike);
router.delete('/cards/:cardId/likes', validateCardId, deleteLike);

module.exports = router;
