const { Router } = require("express");

const router = Router();

router.get("/new/message", (req, res, next) => {
  if (!req.user) {
    return res.render("home");
  }

  res.render("createMessage");
});

router.post("/new/message", async (req, res, next) => {
  res.render("home");
});

module.exports = router;
