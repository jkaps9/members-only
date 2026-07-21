const db = require("../db/queries");
const { Router } = require("express");
const router = Router();

router.get("/new/message", (req, res, next) => {
  if (!req.user) {
    return res.render("home");
  }

  res.render("createMessage");
});

router.post("/new/message", async (req, res, next) => {
  if (!req.user) {
    console.log("no user");
    return res.render("home");
  }

  console.log("inserting message into db");
  await db.createMessage(req.user.id, req.body.title, req.body.message);
  res.redirect("/");
});

module.exports = router;
