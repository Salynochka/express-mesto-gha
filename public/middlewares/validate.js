const { celebrate, Joi } = require('../../node_modules/celebrate');

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30), // ИЗМЕНЕНО
    about: Joi.string().min(2), // ИЗМЕНЕНО
    avatar: Joi.string().pattern(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
});

/* module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.validateChangeAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}); */

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(), // ИЗМЕНЕНО
  }),
});
