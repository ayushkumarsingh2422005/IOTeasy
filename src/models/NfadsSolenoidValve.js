import mongoose from "mongoose";

const NfadsSolenoidValveSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsSolenoidValve || mongoose.model("NfadsSolenoidValve", NfadsSolenoidValveSchema);
