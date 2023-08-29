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

  User.findOne({ email }).select('+password')
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
};

/*  return User.findOne({ email, password })
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
}; */

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.users; // ИЗМЕНЕНО

  User.findOne(userId) // ИЗМЕНЕНО
    .then((user) => {
      if (user) {
        res.send({
          name: req.body.name,
          about: req.body.about,
          _id: userId,
        });
      } res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
    })
    .catch(() => {
      res.status(ERROR_CODE).send({ message: '«На сервере произошла ошибка' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.send(users))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: '«На сервере произошла ошибка' });
    });
};

module.exports.getUserId = (req, res) => {
  // const { userId } = req.params;

  User.findById(req.user._id) // ИЗМЕНЕНО
    .then((user) => {
      if (!user._id) { // ИЗМЕНЕНО
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      res.send({ data: user }); // ИЗМЕНЕНО
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.name === 'DocumentNotFoundError') {
        return NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    // .orFail()
    .then((user) => res.send({
      name: user.name,
      about: user.about,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.name === 'DocumentNotFoundError') {
        return NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    })
    .catch(next);
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    // .orFail()
    .then((user) => res.send({
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.name === 'DocumentNotFoundError') {
        return NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.status(ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    })
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: 'Email или пароль не могут быть пустыми ' });
  }

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
    })
    .catch((err) => { // если данные не записались, вернём ошибку
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA).send({ message: 'Произошла ошибка' });
      } else if (err.code === 11000) {
        res.status(409).send({ message: 'Пользователь уже существует' });
      } else {
        res.status(401).send({ message: err.message });
      }
    });
};
