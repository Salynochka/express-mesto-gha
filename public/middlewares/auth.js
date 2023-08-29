const crypto = require('crypto');
const jwt = require('../../node_modules/jsonwebtoken');

const randomString = crypto
  .randomBytes(16)
  .toString('hex');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', ''); // извлечём токен
  let payload;

  try {
    payload = jwt.verify(token, randomString); // попытаемся верифицировать токен
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' }); // отправим ошибку, если не получилось
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
