const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public"))); // Serve static files from the 'public' directory

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html")); // Update path to point to 'public' directory
});

app.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "../public", "error.html")); // Update path to point to 'public' directory
});

module.exports = (req, res) => app(req, res);
