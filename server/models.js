const mongoose = require("mongoose");

const Region = mongoose.model(
  "Region",
  new mongoose.Schema({
    state: { type: String, required: true, index: true },
    district: { type: String, required: true },
    soil: { type: String, required: true },
  })
);

const Crop = mongoose.model(
  "Crop",
  new mongoose.Schema({ name: { type: String, required: true, unique: true } })
);

const Calculation = mongoose.model(
  "Calculation",
  new mongoose.Schema(
    {
      state: String,
      district: String,
      soil: String,
      crop: String,
      method: String,
      lastIrrigation: String,
      days: [{ label: String, mm: Number }],
    },
    { timestamps: true }
  )
);

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      message: { type: String, required: true, trim: true },
    },
    { timestamps: true }
  )
);

module.exports = { Region, Crop, Calculation, Message };
