const { Router } = require("express");
const db = require("../db/queries");
const router = Router();

router.get("/", async (req, res, next) => {
  if (!req.user) {
    return res.render("home");
  }

  const messages = await db.getMessages();
  next();

  const errorMessage =
    req.query.error === "bad_password"
      ? "Incorrect secret password. Try again."
      : null;

  res.render("index", {
    user: req.user,
    error: errorMessage,
    messages: messages,
  });
});

module.exports = router;
