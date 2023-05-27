const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { jwt: token } = req.cookies;

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, '9198ad99c86faa69436dbd8602f720c5e5d3b33f4958c399e7c278a54a9721dc');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
