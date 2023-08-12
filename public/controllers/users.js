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
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(() => {
      if (!userId) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(404)) {
        res.send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (res.status(500)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => res.send(user))
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(404)) {
        res.send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (res.status(500)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.send(user))
    .catch(() => {
      if (res.status(400)) {
        res.send({ message: 'Произошла ошибка' });
        return;
      }
      if (res.status(404)) {
        res.send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      if (res.status(500)) {
        res.send({ message: 'На сервере произошла ошибка' });
      }
    });
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
