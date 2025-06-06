import mongoose from "mongoose";

const EmsDiaphragmPumpSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsDiaphragmPump || mongoose.model("EmsDiaphragmPump", EmsDiaphragmPumpSchema);
