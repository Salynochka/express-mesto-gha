const jwt = require('../../node_modules/jsonwebtoken');
const NotAuthError = require('../errors/not-auth-error');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    next(new NotAuthError('Необходима авторизация'));
  }
  let payload;

  try {
    payload = jwt.verify(token, 'SomeSecretKey123&'); // попытаемся верифицировать токен
  } catch (err) {
    next(new NotAuthError('Необходима авторизация')); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
