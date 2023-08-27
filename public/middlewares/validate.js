const { celebrate, Joi } = require('../../node_modules/celebrate');

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    avatar: Joi.string().pattern(/https?:\/\/\w{3}?\.\S[0,]*/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24),
  }),
});
