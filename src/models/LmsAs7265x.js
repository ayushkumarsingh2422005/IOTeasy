import mongoose from "mongoose";

const LmsAs7265xSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.LmsAs7265x || mongoose.model("LmsAs7265x", LmsAs7265xSchema);
