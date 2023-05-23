const { isValidObjectId } = require("mongoose");
const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) =>
      res.send(
        users.map(({ _id, name, about, avatar }) => ({
          _id,
          name,
          about,
          avatar,
        }))
      )
    )
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId))
    return res.status(400).send({
      message: "Переданы некорректные данные",
    });

  User.find({ _id: userId })
    .then((data) => {
      if (!data.length)
        return res.status(404).send({
          message: "Пользователь не найден",
        });
      const { _id, name, about, avatar } = user[0];
      res.send({ _id, name, about, avatar });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные для создания пользователя",
        });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
    .then(({ _id, name, about, avatar }) =>
      res.send({ _id, name, about, avatar })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: "Переданы некорректные данные" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
