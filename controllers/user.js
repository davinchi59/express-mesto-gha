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
  User.find({ _id: userId })
    .then((user) => {
      const { _id, name, about, avatar } = user[0];
      res.send({ _id, name, about, avatar });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Пользователь не найден" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar)
    return res.status(400).send({
      message: "Переданы некорректные данные для создания пользователя",
    });
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateUserProfile = (req, res) => {
  const userId = req.user._id;
  if (
    (req.body?.name && !req.body.name.length) ||
    (req.body?.about && !req.body.name.about) ||
    (req.body?.avatar && !req.body.name.avatar)
  )
    return res.status(400).send({
      message: "Переданы некорректные данные для обновления пользователя",
    });

  User.findByIdAndUpdate(userId, req.body)
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(404).send({ message: "Пользователь не найден" });
      } else {
        res.status(500).send({ message: err.message });
      }
    });
};
