import mongoose from "mongoose";

const NfadsWaterPumpSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsWaterPump || mongoose.model("NfadsWaterPump", NfadsWaterPumpSchema);
