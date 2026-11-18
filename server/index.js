require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Region, Crop, Calculation, Message } = require("./models");
const seed = require("./seed");

const app = express();
app.use(cors());
app.use(express.json());

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server." });
  });

// ---- Soil & crop data ----
app.get("/api/states", wrap(async (_req, res) => {
  res.json((await Region.distinct("state")).sort());
}));

app.get("/api/districts", wrap(async (req, res) => {
  const { state } = req.query;
  if (!state) return res.status(400).json({ error: "state is required" });
  const rows = await Region.find({ state }).sort("district").select("district soil -_id");
  res.json(rows);
}));

app.get("/api/crops", wrap(async (_req, res) => {
  res.json((await Crop.find().sort("name")).map((c) => c.name));
}));

// ---- Irrigation ----
// Same simplified estimate as the original site, kept in one place so it is easy to improve.
function estimateIrrigationMm(forecastSlots) {
  return forecastSlots.reduce((total, slot) => {
    const rain = slot.rain?.["3h"] ?? 0;
    const et = (slot.main.temp * slot.main.humidity) / 100;
    return total + Math.max(0, et - rain);
  }, 0);
}

app.post("/api/irrigation", wrap(async (req, res) => {
  const { state, district, soil, crop, method, lastIrrigation } = req.body;
  if (![state, district, soil, crop, lastIrrigation].every(Boolean))
    return res.status(400).json({ error: "Please fill out all required fields." });

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return res.status(500).json({ error: "Weather API key is not configured on the server." });

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    `${district},${state}`
  )}&appid=${key}&units=metric`;
  const weather = await fetch(url);
  if (!weather.ok) return res.status(502).json({ error: "Could not fetch weather for that location." });
  const data = await weather.json();

  const labels = ["Today", "Tomorrow", "Day after"];
  const days = labels.map((label, i) => ({
    label,
    mm: Number(estimateIrrigationMm(data.list.slice(i * 8, i * 8 + 8)).toFixed(2)),
  }));

  await Calculation.create({ state, district, soil, crop, method, lastIrrigation, days });
  res.json({ location: `${district}, ${state}`, days });
}));

app.get("/api/history", wrap(async (_req, res) => {
  res.json(await Calculation.find().sort("-createdAt").limit(5));
}));

// ---- Contact ----
app.post("/api/contact", wrap(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !/^\S+@\S+\.\S+$/.test(email || "") || !message)
    return res.status(400).json({ error: "Please provide a name, valid email and message." });
  await Message.create({ name, email, message });
  res.status(201).json({ ok: true });
}));

// ---- Serve built React app in production ----
const dist = path.join(__dirname, "../client/dist");
app.use(express.static(dist));
app.get("*", (req, res, next) =>
  req.path.startsWith("/api") ? next() : res.sendFile(path.join(dist, "index.html"), (e) => e && next())
);

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agrosense")
  .then(async () => {
    if ((await Region.countDocuments()) === 0) await seed();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((e) => { console.error("MongoDB connection failed:", e.message); process.exit(1); });
