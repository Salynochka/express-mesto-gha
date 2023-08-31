const jwt = require('../../node_modules/jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, 'SomeSecretKey123&'); // попытаемся верифицировать токен
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' }); // отправим ошибку, если не получилось
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
