const Card = require('../models/card');

/* class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
} */

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(500)) {
        res.send({ message: '«На сервере произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { userId } = req.params;

  Card.create({ name, link, owner: userId })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(200).send(data))
        .catch(() => {
          res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        });
    })
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Произошла ошибка' });
      }
      if (res.status(500)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(404).send({ message: 'Запрашиваемый пользователь не найден' }));
};

module.exports.addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      res.send(card);
    })
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(500)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
      }
      res.send(card);
    })
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(500)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
};
