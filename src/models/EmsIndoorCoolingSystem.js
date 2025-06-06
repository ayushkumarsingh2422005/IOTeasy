import mongoose from "mongoose";

const EmsIndoorCoolingSystemSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsIndoorCoolingSystem || mongoose.model("EmsIndoorCoolingSystem", EmsIndoorCoolingSystemSchema);
