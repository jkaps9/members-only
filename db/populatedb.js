require("dotenv").config();
const { Client } = require("pg");
const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const clubPassword = process.env.SECRET_CLUB_PASSWORD;
const secureHashToStore = hashPassword(clubPassword);

console.log("=== SETUP ===");
console.log("Store this exact string in your database:\n", secureHashToStore);
console.log("\n");

const SQL = `
    CREATE TABLE IF NOT EXISTS members(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username VARCHAR ( 255 ) UNIQUE NOT NULL,
        first_name VARCHAR ( 255 ) NOT NULL,
        last_name VARCHAR ( 255 ) NOT NULL,
        password VARCHAR ( 255 ),
        membership_status BOOLEAN DEFAULT FALSE
    );
    
    CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        member_id INTEGER REFERENCES members (id) NOT NULL,
        title VARCHAR ( 255 ) NOT NULL,
        message_body TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inside_access(
      id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      key_name VARCHAR ( 50 ) UNIQUE NOT NULL,
      password VARCHAR ( 255 )
    );
    `;

async function main() {
  const dbUrl = process.argv[2] || process.env.DEV_DB_URL;

  if (!dbUrl) {
    console.error("Error: No database URL provided.");
    process.exit(1);
  }

  console.log(`Seeding to: ${dbUrl.split("@")[1] || "localhost"}...`);

  const isProduction = !dbUrl.includes("localhost");

  const client = new Client({
    connectionString: dbUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("done");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.end();
  }
}

main();
