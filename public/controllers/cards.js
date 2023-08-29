const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');

const INCORRECT_DATA = 400;
const ERROR_CODE = 500;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards })) // ИСПРАВЛЕНО
    .catch(next); // ИСПРАВЛЕНО
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id }) // ИЗМЕНЕНО
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      _id: card._id,
      owner: req.params.userId, // ИЗМЕНЕНО
    })) // ИЗМЕНЕНО
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else { res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }); }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
      }
      Card.findByIdAndRemove(req.params.cardId) // ИЗМЕНЕНО
        .then(() => res.send({ message: 'Карточка удалена' }))
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
          } else {
            res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
          }
        });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return NotFoundError('Запрашиваемая карточка не найдена');
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.name === 'DocumentNotFoundError') {
        return NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) {
        res.send(card);
      }
      return NotFoundError('Запрашиваемая карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
      } else if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};
