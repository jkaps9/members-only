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

exports.getSuperSecretPassword = async function (key_name) {
  const { rows } = await pool.query(
    "SELECT * FROM inside_access WHERE key_name = $1",
    [key_name],
  );
  return rows;
};

exports.updateMemberStatus = async function (member_id, new_status) {
  await pool.query("UPDATE members SET membership_status = $1 WHERE id = $2", [
    new_status,
    member_id,
  ]);
};

exports.createMessage = async function (member_id, title, message) {
  await pool.query(
    "INSERT INTO messages (member_id, title, message_body) VALUES ($1, $2, $3)",
    [member_id, title, message],
  );
};

exports.getMessages = async function () {
  const { rows } = await pool.query("SELECT * FROM messages LIMIT 100;");
  return rows;
};
