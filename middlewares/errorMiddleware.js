module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    console.log(err.statusCode, err.message);
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
  next();
};
