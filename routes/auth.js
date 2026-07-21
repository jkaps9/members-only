const { Router } = require("express");
const router = Router();

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureMessage: true,
  }),
);

router.get("/sign-up", (req, res) => res.render("sign-up-form"));

router.post("/sign-up", async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO members (username, password) VALUES ($1, $2)",
      [req.body.username, hashedPassword],
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
