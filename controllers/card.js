const Card = require("../models/card");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) =>
      res.send(
        cards.map(({ _id, name, link, owner, likes }) => ({
          _id,
          name,
          link,
          owner,
          likes,
        }))
      )
    )
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  if (!name || !link || !owner)
    return res.status(400).send({
      message: "Переданы некорректные данные для создания карточки",
    });
  Card.create({ name, link, owner })
    .then(({ _id, name, link, owner, likes }) =>
      res.send({ _id, name, link, owner, likes })
    )
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.removeCard = (req, res) => {
  const { cardId } = req.params;

  Card.deleteOne({ _id: cardId })
    .then(() => res.status(200).send())
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Карточка не найдена" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.addCardLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!userId)
    return res.status(400).send({
      message: "Переданы некорректные данные для постановки лайка",
    });

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => res.send(card.likes))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Карточка не найдена" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.removeCardLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!userId)
    return res.status(400).send({
      message: "Переданы некорректные данные для снятия лайка",
    });

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => res.send(card.likes))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Карточка не найдена" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
