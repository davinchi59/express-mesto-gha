const celebrate = require('celebrate');
const IncorrectDataError = require('../errors/IncorrectDataError');

module.exports = (err, req, res, next) => {
  if (celebrate.isCelebrateError(err)) {
    res.status(400).send({ message: 'Переданы неверные данные' });
  } else if (err.statusCode) {
    console.log(err.statusCode, err.message);
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
  next();
};
