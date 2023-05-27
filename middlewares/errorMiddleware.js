const celebrate = require('celebrate');

module.exports = (err, req, res, next) => {
  if (celebrate.isCelebrateError(err)) {
    res.status(400).send({ message: err.details.get('body').message });
  } else if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
  // console.log(err.statusCode);
  // res.status(err.statusCode).send({ message: err.message });
  next();
};
