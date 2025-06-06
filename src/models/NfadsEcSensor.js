import mongoose from "mongoose";

const NfadsEcSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsEcSensor || mongoose.model("NfadsEcSensor", NfadsEcSensorSchema);
