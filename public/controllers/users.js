const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
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

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch(() => res.status(400).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  if (req.params.userId) {
    User.findByIdAndUpdate(req.params.userId, { name, about }, { new: 'true' })
      .then((user) => res.status(200).send(user))
      .catch(() => {
        if (res.status(400)) {
          res.send({ message: 'Произошла ошибка' });
          return;
        }
        if (res.status(404)) {
          res.send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(400).send({ message: 'Произошла ошибка' });
  }
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.params;

  if (userId) {
    User.findByIdAndUpdate(userId, { avatar }, { new: 'true' })
      .then((user) => res.status(200).send(user))
      .catch(() => {
        if (res.status(400)) {
          res.send({ message: 'Произошла ошибка' });
          return;
        }
        if (res.status(404)) {
          res.send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
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
      if (res.status(400)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(500)) {
        res.send({ message: 'На сервере произошла ошибка' });
        return;
      }
      console.log(`Произошла неизвестная ошибка ${err.name}: ${err.message}`);
    });
};
