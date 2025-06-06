import mongoose from "mongoose";

const LmsOledModuleLmsSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsOledModuleLms || mongoose.model("LmsOledModuleLms", LmsOledModuleLmsSchema);
