const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerCards = require('./public/routes/cards');
const routerUsers = require('./public/routes/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('connected to db');
});

const app = express();

/* app.get('/users', (req, res) => {
  res.send('Получил пользователей');
});

app.get('/users/1', (req, res) => {
  res.send('Пользователь 1');
});

app.post('/users', (req, res) => {
  res.send('Опубликовал пользователя');
}); */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/cards', routerCards);
app.use('/users', routerUsers);

app.use((req, res, next) => {
  req.user = {
    _id: '64d6142e6d62d57db1306e64',
  };

  next();
});

app.listen(PORT);
