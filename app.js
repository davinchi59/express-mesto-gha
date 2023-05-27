const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/user');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { celebrate } = require('celebrate');
const Joi = require('joi');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post('/signup', createUser);

app.use(authMiddleware);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use((req, res) => {
  res.status(404).send({ message: 'Такого роута не существует' });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Сервер запущен на порте 3000');
});
