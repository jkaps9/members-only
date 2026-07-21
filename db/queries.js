const pool = require("./pool");

exports.getMemberByUsername = async function (username) {
  const { rows } = await pool.query(
    "SELECT * FROM members WHERE username = $1",
    [username],
  );

  return rows;
};

exports.getMemberById = async function (id) {
  const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [
    id,
  ]);

  return rows;
};

exports.insertMember = async function (
  firstName,
  lastName,
  username,
  password,
) {
  await pool.query(
    "INSERT INTO members (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, username, password],
  );
};
