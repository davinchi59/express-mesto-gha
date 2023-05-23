const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = { _id: "646b8954ab09556f6c81e8fd" };
  next();
});

app.use("/users", require("./routes/user"));
app.use("/cards", require("./routes/card"));

app.use((req, res, next) => {
  res.status(404).send({ message: "Такого роута не существует" });
});

app.listen(PORT, () => {
  console.log("Сервер запущен на порте 3000");
});
