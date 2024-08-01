const express = require("express");
const path = require("path");
const app = express();

const { Pool } = require("pg");
const cors = require("cors");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");



app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from the 'public' directory
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html")); // Update path to point to 'public' directory
});

app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

const { DATABASE_URL, SECRET_KEY } = process.env;

// Initialize the PostgreSQL connection
const pool = new Pool({
  connectionString: DATABASE_URL,

  ssl: {
    // require: true,
    rejectUnauthorized: false,
  },
});

(async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
  }
})();

// Function to fetch PostgreSQL version
async function getPostgreSQLVersion() {
  const client = await pool.connect();
  try {
    const response = await client.query("SELECT VERSION()");
    // Print the first row containing version info
    console.log(response.rows[0]);
    // Return version information
    return response.rows[0];
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
}
getPostgreSQLVersion();

//fetch all post
app.get("/posts", async (req, res) => {
  const client = await pool.connect();
  try {
    //SQL query
    const query = "SELECT * FROM ALLPOSTS ORDER BY create_at ASC";
    console.log(query);

    //Execute sql quete
    const execute = await client.query(query);
    console.log(execute);
    //Response to client
    res.status(200).json(execute.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  } finally {
    client.release();
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public", "error.html")); // Update path to point to 'public' directory
});

module.exports = (req, res) => app(req, res);
