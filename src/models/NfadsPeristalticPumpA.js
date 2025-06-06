import mongoose from "mongoose";

const NfadsPeristalticPumpASchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsPeristalticPumpA || mongoose.model("NfadsPeristalticPumpA", NfadsPeristalticPumpASchema);
