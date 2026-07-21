const { Router } = require("express");

const router = Router();

router.get("/", function (req, res, next) {
  if (!req.user) {
    return res.render("home");
  }
  next();

  const errorMessage =
    req.query.error === "bad_password"
      ? "Incorrect secret password. Try again."
      : null;

  res.render("index", { user: req.user, error: errorMessage });
});

module.exports = router;
