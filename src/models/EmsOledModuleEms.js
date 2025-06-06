import mongoose from "mongoose";

const EmsOledModuleEmsSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsOledModuleEms || mongoose.model("EmsOledModuleEms", EmsOledModuleEmsSchema);
