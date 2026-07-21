const db = require("../db/queries");
const { Router } = require("express");
const router = Router();

router.get("/new/message", (req, res, next) => {
  if (!req.user) {
    return res.redirect("/");
  }

  res.render("createMessage");
});

router.post("/new/message", async (req, res, next) => {
  if (!req.user) {
    console.log("no user");
    return res.redirect("/");
  }

  console.log("inserting message into db");
  await db.createMessage(req.user.id, req.body.title, req.body.message);
  res.redirect("/");
});

router.post("/message/delete", async (req, res) => {
  if (!req.user || !req.user.admin_status) {
    console.log("no user");
    return res.redirect("/");
  }
  await db.deleteMessage(req.body.messageId);
  res.redirect("/");
});

module.exports = router;
