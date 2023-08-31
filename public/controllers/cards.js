const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');

const INCORRECT_DATA = 400;
const ERROR_CODE = 500;

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(next); // ИСПРАВЛЕНО
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  // const { owner } = req.params;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return NotFoundError('Запрашиваемая карточка не найдена');
      }
      return res.send();
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.params.userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return NotFoundError('Запрашиваемая карточка не найдена');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.params.userId } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card.owner === req.user._id) {
        res.send(card);
      }
      return NotFoundError('Запрашиваемая карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
