const mongoose = require('mongoose');
const validator = require('../../node_modules/validator');
const { link } = require('../routes/cards');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: link('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  },
  email: {
    validate: validator.isEmail,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    validate: validator.isPassportNumber,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
