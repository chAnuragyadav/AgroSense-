require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Region, Crop, Calculation, Message } = require("./models");
const seed = require("./seed");

// Cached connection: reused across warm serverless invocations and across local requests.
const cache = global.__agrosenseMongo || (global.__agrosenseMongo = { promise: null });

function connectDB() {
  if (!cache.promise) {
    const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI environment variable is missing");
}
    cache.promise = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 8000 })
      .then(async () => {
        if ((await Region.countDocuments()) === 0) await seed();
      })
      .catch((err) => {
        cache.promise = null; // allow retry on next request
        throw err;
      });
  }
  return cache.promise;
}

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed. Check MONGO_URI." });
  }
});

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


// ---- Weather ----
app.get("/api/weather", wrap(async (req, res) => {
  const { state, district } = req.query;
  if (!state || !district) return res.status(400).json({ error: "state and district are required" });
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return res.status(500).json({ error: "Weather API key is not configured on the server." });

  const q = encodeURIComponent(`${district},${state}`);
  const base = "https://api.openweathermap.org/data/2.5";
  const [curRes, fcRes] = await Promise.all([
    fetch(`${base}/weather?q=${q}&appid=${key}&units=metric`),
    fetch(`${base}/forecast?q=${q}&appid=${key}&units=metric`),
  ]);
  if (!curRes.ok || !fcRes.ok) return res.status(502).json({ error: "Could not fetch weather for that location." });
  const cur = await curRes.json();
  const fc = await fcRes.json();

  const byDate = {};
  for (const slot of fc.list) {
    const d = slot.dt_txt.slice(0, 10);
    const day = (byDate[d] ||= { date: d, min: Infinity, max: -Infinity, rain: 0, icon: slot.weather[0].icon, text: slot.weather[0].main });
    day.min = Math.min(day.min, slot.main.temp_min);
    day.max = Math.max(day.max, slot.main.temp_max);
    day.rain += slot.rain?.["3h"] ?? 0;
    if (slot.dt_txt.includes("12:00:00")) { day.icon = slot.weather[0].icon; day.text = slot.weather[0].main; }
  }

  res.json({
    location: `${district}, ${state}`,
    current: {
      temp: cur.main.temp, feelsLike: cur.main.feels_like, humidity: cur.main.humidity,
      wind: cur.wind.speed, description: cur.weather[0].description, icon: cur.weather[0].icon,
    },
    forecast: Object.values(byDate).slice(0, 5).map((d) => ({ ...d, rain: Number(d.rain.toFixed(1)) })),
  });
}));

// ---- Contact ----
app.post("/api/contact", wrap(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !/^\S+@\S+\.\S+$/.test(email || "") || !message)
    return res.status(400).json({ error: "Please provide a name, valid email and message." });
  await Message.create({ name, email, message });
  res.status(201).json({ ok: true });
}));


module.exports = { app, connectDB };
