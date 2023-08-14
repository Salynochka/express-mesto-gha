const Card = require('../models/card');

const INCORRECT_DATE = 400;
const NOT_FOUND_ERROR = 404;
const ERROR_CODE = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => {
      if (res.status(INCORRECT_DATE)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(ERROR_CODE)) {
        res.send({ message: '«На сервере произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.params._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(200).send(data))
        .catch(() => {
          res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
        });
    })
    .catch(() => {
      if (res.status(INCORRECT_DATE)) {
        res.send({ message: 'Произошла ошибка' });
      }
      if (res.status(ERROR_CODE)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  if (req.params.userId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
          return;
        }
        res.status(200).send();
      })
      .catch(() => res.status(INCORRECT_DATE).send({ message: 'Произошла ошибка' }));
  }
};

module.exports.addLike = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        res.status(200).send(card);
      })
      .catch(() => {
        if (res.status(INCORRECT_DATE)) {
          res.send({ message: 'Произошла ошибка' });
          return;
        }
        if (res.status(ERROR_CODE)) {
          res.send({ message: 'На сервере произошла ошибка' });
        }
      });
  }
};

module.exports.deleteLike = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемая карточка не найдена' });
        }
        res.status(200).send(card);
      })
      .catch(() => {
        if (res.status(INCORRECT_DATE)) {
          res.send({ message: 'Произошла ошибка' });
          return;
        }
        if (res.status(ERROR_CODE)) {
          res.send({ message: 'На сервере произошла ошибка' });
        }
      });
  }
};

/* class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
} */
