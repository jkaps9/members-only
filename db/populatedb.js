require("dotenv").config();
const { Client } = require("pg");

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
    `;

console.log(SQL);
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
