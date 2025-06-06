import mongoose from "mongoose";

const EmsDht22MoistureSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsDht22Moisture || mongoose.model("EmsDht22Moisture", EmsDht22MoistureSchema);
