require("dotenv").config();
const mongoose = require("mongoose");
const { Region, Crop } = require("./models");

async function seed() {
  await Region.deleteMany({});
  await Crop.deleteMany({});
  await Region.insertMany(require("./data/soil.json"));
  await Crop.insertMany(require("./data/crops.json").map((name) => ({ name })));
  console.log("Seeded regions and crops");
}

module.exports = seed;

if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agrosense")
    .then(seed)
    .then(() => mongoose.disconnect())
    .catch((e) => { console.error(e); process.exit(1); });
}
