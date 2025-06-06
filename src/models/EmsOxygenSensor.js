import mongoose from "mongoose";

const EmsOxygenSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsOxygenSensor || mongoose.model("EmsOxygenSensor", EmsOxygenSensorSchema);
