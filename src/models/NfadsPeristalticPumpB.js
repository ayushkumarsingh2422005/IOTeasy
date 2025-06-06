import mongoose from "mongoose";

const NfadsPeristalticPumpBSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsPeristalticPumpB || mongoose.model("NfadsPeristalticPumpB", NfadsPeristalticPumpBSchema);
