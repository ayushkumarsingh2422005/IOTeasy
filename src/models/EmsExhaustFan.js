import mongoose from "mongoose";

const EmsExhaustFanSchema = new mongoose.Schema({
  "Value": String,
}, { timestamps: true });

export default mongoose.models.EmsExhaustFan || mongoose.model("EmsExhaustFan", EmsExhaustFanSchema);
