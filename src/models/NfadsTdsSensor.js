import mongoose from "mongoose";

const NfadsTdsSensorSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsTdsSensor || mongoose.model("NfadsTdsSensor", NfadsTdsSensorSchema);
