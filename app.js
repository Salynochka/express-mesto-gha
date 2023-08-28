// const router = require('express').Router();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const routerCards = require('./public/routes/cards');
const routerUsers = require('./public/routes/users');
const { login, createUser } = require('./public/controllers/users');
const auth = require('./public/middlewares/auth');
const { validateLogin, validateNewUser } = require('./public/middlewares/validate');

const { PORT = 3000 } = process.env;

const app = express();

// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

app.post('/signup', validateNewUser, createUser);
app.post('/signin', validateLogin, login);

app.use(auth, (req, res) => {
  if (!auth) {
    res.status(401).send({ message: 'Необходимо авторизоваться' });
  }
  return res.send({ message: 'Всё в порядке' });
}, routerUsers);

app.use('/cards', routerCards);

app.use('/users', routerUsers);

app.use('*', (req, res) => res.status(404).send({ message: 'Неправильный путь' }));

app.use(errors());

app.use((err, req, res) => {
  res.send({ message: err.message }); // это обработчик ошибки
});

app.listen(PORT);
