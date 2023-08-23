const mongoose = require('mongoose');
// const validator = require('../../node_modules/validator');

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
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    // validate: validator.isEmail()(true),
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    // validate: validator.isPassportNumber,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
