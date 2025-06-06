import mongoose from "mongoose";

const NfadsPhSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsPhSensor || mongoose.model("NfadsPhSensor", NfadsPhSensorSchema);
