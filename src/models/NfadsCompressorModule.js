import mongoose from "mongoose";

const NfadsCompressorModuleSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsCompressorModule || mongoose.model("NfadsCompressorModule", NfadsCompressorModuleSchema);
