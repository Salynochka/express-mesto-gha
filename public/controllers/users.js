const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('../../node_modules/jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');

const INCORRECT_DATA = 400;
const ERROR_CODE = 500;

const randomString = crypto
  .randomBytes(16)
  .toString('hex');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findOne({ email, password })
    .then((userId) => {
      const token = jwt.sign({ _id: userId }, randomString, { expiresIn: '7d' });
      res.send({ token });
      res
        .cookie('jwt', token, { // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
      // res.status(ERROR_CODE).send({ message: '«На сервере произошла ошибка' });
    });
};

/* User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return res.send({ message: 'Всё верно!' }); // аутентификация успешна
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, randomString, { expiresIn: '7d' });
      res.send({ token });
      res
        .cookie('jwt', token, { // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
      // res.status(ERROR_CODE).send({ message: '«На сервере произошла ошибка' });
    });
}; */

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.params; // используем req.user

  User.findOne({
    name: req.body.name,
    about: req.body.about,
    _id: userId,
  })
    .then((user) => {
      if (user) {
        res.send({ user });
      } res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: '«На сервере произошла ошибка' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: '«На сервере произошла ошибка' });
    });
};

module.exports.getUserId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  // ИЗМЕНЕНО
  User.findByIdAndUpdate(req.params.userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else { res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }); }
    })
    .catch(next);
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.params.userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else { res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' }); }
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10) // записываем данные в базу
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201)
        .send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    }) // ИЗМЕНЕНО
    .catch((err) => { // если данные не записались, вернём ошибку
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else {
        res.status(401).send({ message: err.message }); // ИЗМЕНЕНО
      }
    });
};
