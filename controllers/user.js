const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose');
const IncorrectDataError = require('../errors/IncorrectDataError');
const NotAuthError = require('../errors/NotAuthError');
const AlreadyExistsError = require('../errors/AlreadyExistsError');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  let { userId } = req.params;

  if (!userId || userId === 'me') {
    userId = req.user._id;
  }

  if (!isValidObjectId(userId)) {
    throw new IncorrectDataError('Переданы некорректные данные для получения данных пользователя');
  }

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь с таким "_id" не найден'));
      }
      next(err);
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new IncorrectDataError('Переданы некорректные данные для получения данных пользователя');
  }

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные для создания пользователя'));
      } else if (err.code === 11000) {
        next(new AlreadyExistsError('Пользователь с таким Email уже существует'));
      } else {
        next(new Error(err.message));
      }
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные для обновления данных пользователя'));
      } else {
        next(new Error(err.message));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then(async (user) => {
      if (!user) {
        throw new NotAuthError('Почта или пароль введены неверно');
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        throw new NotAuthError('Почта или пароль введены неверно');
      }
      const token = jwt.sign({ _id: user._id }, '9198ad99c86faa69436dbd8602f720c5e5d3b33f4958c399e7c278a54a9721dc', { expiresIn: '7d' });
      res.status(200).cookie('jwt', token, { httpOnly: true }).send({ _id: user._id });
    })
    .catch(next);
};
