const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get("/version", (req, res) => {
  res.json({
    version: "1.0.0"
  });
});

app.get("/metrics", (req, res) => {
  res.json({
    message: "metrics endpoint (to be implemented later)"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
