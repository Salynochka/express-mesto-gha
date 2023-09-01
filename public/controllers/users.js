const bcrypt = require('bcryptjs');
const jwt = require('../../node_modules/jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const ServerError = require('../errors/server-error');
const AlreayExistError = require('../errors/already-exist-error');

module.exports.login = (req, res, next) => {
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
      const token = jwt.sign({ _id: user._id }, 'SomeSecretKey123&', { expiresIn: '7d' });
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
      res.send({ message: 'Вы авторизовались' });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          _id: user._id,
        });
        return;
      }
      throw new IncorrectDataError('Произошла ошибка');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ServerError('На сервере произошла ошибка'));
        return;
      }
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Произошла ошибка'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
        });
        return;
      } throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Произошла ошибка'));
        return;
      }
      next(err);
    });
};

module.exports.changeAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.send({
          avatar: user.avatar,
        }); return;
      } throw new NotFoundError('Запрашиваемый пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Произошла ошибка'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
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
        next(new IncorrectDataError('Произошла ошибка'));
      } else if (err.code === 11000) {
        next(new AlreayExistError('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};
