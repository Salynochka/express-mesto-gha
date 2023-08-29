const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');

const INCORRECT_DATA = 400;
const ERROR_CODE = 500;

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.send({ cards })) // ИЗМЕНЕНО
    .catch(next); // ИСПРАВЛЕНО
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { owner } = req.users; // ИЗМЕНЕНО

  Card.create({ name, link, owner })
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      _id: card._id,
      owner: card.owner, // ИЗМЕНЕНО
    }))
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
    { $addToSet: { likes: req.users.userId } }, // ИЗМЕНЕНО
    { new: true },
  )
    .then((card) => {
      if (!card._id) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
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
    { $pull: { likes: req.users.userId } }, // убрать _id из массива // ИЗМЕНЕНО
    { new: true },
  )
    .then((card) => {
      if (card.owner === req.users.userId) { // ИЗМЕНЕНО
        return res.send(card); // ИЗМЕНЕНО
      }
      throw new NotFoundError('Запрашиваемая карточка не найдена'); // ИЗМЕНЕНО
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
