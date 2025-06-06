import mongoose from "mongoose";

const LmsGrowLightsBSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsGrowLightsB || mongoose.model("LmsGrowLightsB", LmsGrowLightsBSchema);
