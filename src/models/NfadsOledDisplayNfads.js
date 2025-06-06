import mongoose from "mongoose";

const NfadsOledDisplayNfadsSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.NfadsOledDisplayNfads || mongoose.model("NfadsOledDisplayNfads", NfadsOledDisplayNfadsSchema);
