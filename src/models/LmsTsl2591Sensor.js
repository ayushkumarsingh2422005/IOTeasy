import mongoose from "mongoose";

const LmsTsl2591SensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsTsl2591Sensor || mongoose.model("LmsTsl2591Sensor", LmsTsl2591SensorSchema);
