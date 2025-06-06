import mongoose from "mongoose";

const LmsGrowLightsCSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsGrowLightsC || mongoose.model("LmsGrowLightsC", LmsGrowLightsCSchema);
