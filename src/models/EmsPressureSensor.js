import mongoose from "mongoose";

const EmsPressureSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsPressureSensor || mongoose.model("EmsPressureSensor", EmsPressureSensorSchema);
