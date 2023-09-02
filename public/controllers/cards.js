const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find()
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      _id: card._id,
      owner: card.owner,
      likes: card.likes,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Произошла ошибка'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      } else if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      } else {
        Card.deleteOne(card)
          .then((deletedCard) => {
            res.status(200).send({ data: deletedCard });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Произошла ошибка'));
        return;
      }
      next(err);
    });
};

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Произошла ошибка'));
      } else if (err.name === 'CastError') {
        next(new IncorrectDataError('Произошла ошибка'));
        return;
      }
      next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card.owner === req.user._id) {
        res.send({ data: card });
        return;
      }
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Произошла ошибка'));
        return;
      }
      next(err);
    });
};
