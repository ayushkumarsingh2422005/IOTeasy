import mongoose from "mongoose";

const NfadsWaterFlowMeterSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsWaterFlowMeter || mongoose.model("NfadsWaterFlowMeter", NfadsWaterFlowMeterSchema);
