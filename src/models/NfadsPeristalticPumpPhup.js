import mongoose from "mongoose";

const NfadsPeristalticPumpPhupSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsPeristalticPumpPhup || mongoose.model("NfadsPeristalticPumpPhup", NfadsPeristalticPumpPhupSchema);
