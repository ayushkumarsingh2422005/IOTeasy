import mongoose from "mongoose";

const LmsDimmableModuleSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsDimmableModule || mongoose.model("LmsDimmableModule", LmsDimmableModuleSchema);
