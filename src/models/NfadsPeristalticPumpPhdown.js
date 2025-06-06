import mongoose from "mongoose";

const NfadsPeristalticPumpPhdownSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsPeristalticPumpPhdown || mongoose.model("NfadsPeristalticPumpPhdown", NfadsPeristalticPumpPhdownSchema);
