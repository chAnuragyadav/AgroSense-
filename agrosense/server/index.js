// Local development / traditional hosting entry point.
// On Netlify the same app runs through netlify/functions/api.js instead.
const path = require("path");
const express = require("express");
const { app, connectDB } = require("./app");

const dist = path.join(__dirname, "../client/dist");
app.use(express.static(dist));
app.get("*", (req, res, next) =>
  req.path.startsWith("/api") ? next() : res.sendFile(path.join(dist, "index.html"), (e) => e && next())
);

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)))
  .catch((e) => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
