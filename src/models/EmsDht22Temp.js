import mongoose from "mongoose";

const EmsDht22TempSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsDht22Temp || mongoose.model("EmsDht22Temp", EmsDht22TempSchema);
