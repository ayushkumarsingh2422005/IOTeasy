import mongoose from "mongoose";

const NfadsWaterTemperatureSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsWaterTemperatureSensor || mongoose.model("NfadsWaterTemperatureSensor", NfadsWaterTemperatureSensorSchema);
