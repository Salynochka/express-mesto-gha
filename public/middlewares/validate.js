const { celebrate, Joi } = require('../../node_modules/celebrate');

const newLocal = /https?:\/\/\w{3}?\.\S[0,]*/;
const regex = newLocal;

module.exports.validateUser = celebrate({
  body: Joi.object().keys({
    _id: Joi.string(),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    avatar: regex.test(Joi.str),
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
