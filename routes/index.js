const { Router } = require("express");

const router = Router();

router.get("/", function (req, res, next) {
  if (!req.user) {
    return res.render("home");
  }
  next();
  res.render("index", { user: req.user });
});

router.post("/inside-access", async (req, res, next) => {
  try {
  } catch (error) {
    console.error("bad request", error);
  }
});

module.exports = router;
