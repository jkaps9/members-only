const { Router } = require("express");

const router = Router();

router.get("/", function (req, res, next) {
  if (!req.user) {
    return res.render("home");
  }
  next();
  res.render("index", { user: req.user });
});

module.exports = router;
