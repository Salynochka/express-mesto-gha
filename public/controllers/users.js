const bcrypt = require('bcryptjs');
const jwt = require('../../node_modules/jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const IncorrectDataError = require('../errors/incorrect-data-error');
const ServerError = require('../errors/server-error');
const AlreayExistError = require('../errors/already-exist-error');
const NotAuthError = require('../errors/not-auth-error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        Promise.reject(new NotAuthError('Неправильные почта или пароль'));
      }
      res.send({ message: 'Всё верно!' }); // аутентификация успешна
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'SomeSecretKey123&', { expiresIn: '7d' });
      res.send({ token });
      res
        .cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .end();
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById({ userId })
    .then((user) => {
      if (user) {
        res.send({
          name: req.body.name,
          about: req.body.about,
          _id: userId,
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
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({
      name: user.name,
      about: user.about,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Произошла ошибка'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      next(err);
    });
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
        next(new IncorrectDataError('Произошла ошибка'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new IncorrectDataError('Email или пароль не могут быть пустыми '));
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
