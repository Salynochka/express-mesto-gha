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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.user = {
    _id: '64db4402b530d3ec56da7380',
  };

  next();
});

app.use('/cards', routerCards);
app.use('/users', routerUsers);

app.use('*', (req, res) => res.status(404).send({ message: 'Неправильный путь' }));

app.listen(PORT);
