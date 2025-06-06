import mongoose from "mongoose";

const NfadsPeltierModuleSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsPeltierModule || mongoose.model("NfadsPeltierModule", NfadsPeltierModuleSchema);
