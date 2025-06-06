import mongoose from "mongoose";

const EmsCarbonDioxideSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsCarbonDioxideSensor || mongoose.model("EmsCarbonDioxideSensor", EmsCarbonDioxideSensorSchema);
