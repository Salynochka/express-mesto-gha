const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');

const INCORRECT_DATA = 400;
const ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards)) // ИСПРАВЛЕНО
    .catch(() => {
      res.status(ERROR_CODE).send({ message: '«На сервере произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.params.userId }) // ИЗМЕНЕНО
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      _id: card._id,
    })) // ИЗМЕНЕНО
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else { res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }); }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return NotFoundError('Запрашиваемая карточка не найдена');
      }
      return res.send(); // ИЗМЕНЕНО
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
    { $addToSet: { likes: req.params.userId } }, // ИЗМЕНЕНО
    { new: true },
  )
    .then((card) => {
      if (!card._id) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send(card);
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
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
