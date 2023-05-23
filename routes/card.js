const router = require("express").Router();
const {
  getCards,
  createCard,
  removeCard,
  addCardLike,
  removeCardLike,
} = require("../controllers/card");

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", removeCard);
router.put("/:cardId/likes", addCardLike);
router.delete("/:cardId/likes", removeCardLike);

module.exports = router;
