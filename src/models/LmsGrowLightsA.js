import mongoose from "mongoose";

const LmsGrowLightsASchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsGrowLightsA || mongoose.model("LmsGrowLightsA", LmsGrowLightsASchema);
