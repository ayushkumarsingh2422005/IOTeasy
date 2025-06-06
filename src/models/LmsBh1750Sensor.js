import mongoose from "mongoose";

const LmsBh1750SensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsBh1750Sensor || mongoose.model("LmsBh1750Sensor", LmsBh1750SensorSchema);
