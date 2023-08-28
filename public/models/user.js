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

/* userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { */
/*  Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // аутентификация успешна
        });
    });
}; */
