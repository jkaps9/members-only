require("dotenv").config();
const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const assetsPath = path.join(__dirname, "public");

const connectionString = process.env.DATABASE_URL || process.env.DEV_DB_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: false,
});

app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/", authRouter);

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
