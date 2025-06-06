import mongoose from "mongoose";

const LmsLdrSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsLdrSensor || mongoose.model("LmsLdrSensor", LmsLdrSensorSchema);
