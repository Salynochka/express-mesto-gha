const { celebrate, Joi } = require('../../node_modules/celebrate');

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24),
  }),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    _id: Joi.string().required().length(24),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    _id: Joi.string().length(24),
  }),
});
