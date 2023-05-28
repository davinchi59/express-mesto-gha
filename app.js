const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/user');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/errorMiddleware');
const NotFoundError = require('./errors/NotFoundError');
const SignUpValidation = require('./middlewares/validations/SignUpValidation');
const SignInValidation = require('./middlewares/validations/SignInValidation');

const { PORT = 3000 } = process.env;

const app = express();

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post(
  '/signin',
  SignInValidation,
  login,
);
app.post(
  '/signup',
  SignUpValidation,
  createUser,
);

app.use(authMiddleware);

app.use('/users', require('./routes/user'));
app.use('/cards', require('./routes/card'));

app.use((req, res, next) => {
  next(new NotFoundError('Такого роута не существует'));
});

app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log('Сервер запущен на порте 3000');
});
