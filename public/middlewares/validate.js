const { celebrate, Joi } = require('../../node_modules/celebrate');

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    avatar: Joi.string().pattern(/https?:\/\/\w{3}?\.\S[0,]*/),
    email: Joi.string().required().min(2),
    password: Joi.string().required().min(2),
  }),
});

module.exports.validateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    _id: Joi.string().required().min(2),
  }),
});
