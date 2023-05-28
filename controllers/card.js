const { isValidObjectId } = require('mongoose');
const ForbiddenError = require('../errors/ForbiddenError');
const IncorrectDataError = require('../errors/IncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(
        cards.map((card) => ({
          _id: card._id,
          name: card.name,
          link: card.link,
          owner: card.owner,
          likes: card.likes,
        })),
      );
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({
        _id: card._id,
        name: card.name,
        link: card.link,
        owner: card.owner,
        likes: card.likes,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные для создания карточки'));
      } else {
        next(new Error(err.message));
      }
    });
};

module.exports.removeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  if (!isValidObjectId(cardId)) {
    throw new IncorrectDataError('Переданы некорректные данные для удаления карточки');
  }
  Card.findById(cardId).orFail()
    .then((card) => {
      if (!card.owner.equals(userId)) {
        throw new ForbiddenError('Вы не можете удалить данную карточку');
      }
      return Card.deleteOne({ _id: cardId });
    })
    .then(({ deletedCount }) => {
      if (!deletedCount) {
        throw new Error('Серверная ошибка');
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      }
      next(err);
    });
  // Card.deleteOne({ _id: cardId, owner: userId })
  //   .then(({ deletedCount }) => {
  //     if (!deletedCount) {
  //       throw new ForbiddenError('Неверные данные для удаления');
  //     }
  //     return res.status(200).send({ message: 'Карточка удалена' });
  //   })
  //   .catch(next);
};

module.exports.addCardLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(userId) || !isValidObjectId(cardId)) {
    throw new IncorrectDataError('Переданы некорректные данные для постановки лайка');
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card.likes);
    })
    .catch(next);
};

module.exports.removeCardLike = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(userId) || !isValidObjectId(cardId)) {
    throw new IncorrectDataError('Переданы некорректные данные для снятия лайка');
  }

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }
      return res.send(card.likes);
    })
    .catch(next);
};
