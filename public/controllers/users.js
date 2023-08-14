const User = require('../models/user');

const INCORRECT_DATE = 400;
const NOT_FOUND_ERROR = 404;
const ERROR_CODE = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      if (res.status(INCORRECT_DATE)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(ERROR_CODE)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND_ERROR).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(INCORRECT_DATE).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true' })
      .then((user) => res.status(200).send(user))
      .catch(() => {
        if (res.status(INCORRECT_DATE)) {
          res.send({ message: 'Произошла ошибка' });
          return;
        }
        if (res.status(NOT_FOUND_ERROR)) {
          res.send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(INCORRECT_DATE).send({ message: 'Произошла ошибка' });
  }
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;

  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar }, { new: 'true' })
      .then((user) => res.status(200).send(user))
      .catch(() => {
        if (res.status(INCORRECT_DATE)) {
          res.send({ message: 'Произошла ошибка' });
          return;
        }
        if (res.status(NOT_FOUND_ERROR)) {
          res.send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.createUser = (req, res) => {
  // записываем данные в базу
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    // возвращаем записанные в базу данные пользователю
    .then((user) => res.status(201).send(user))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (res.status(INCORRECT_DATE)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(ERROR_CODE)) {
        res.send({ message: 'На сервере произошла ошибка' });
        return;
      }
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
    });
};
