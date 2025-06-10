import mongoose from "mongoose";

const LmsSchema = new mongoose.Schema({
    as7265x: {
        type: Number, //
    },
    bh1750: {
        type: Number, //
    },
    growLights: {
        type: Boolean, //
    },
    ldr: {
        type: Number, //
    },
    tsl2591: {
        type: Number, //
    },
    dimmable: {
        type: Boolean, //
    },
    oled: {
        type: Boolean, //
    }
}, { timestamps: true });

export default mongoose.models.Lms || mongoose.model("Lms", LmsSchema);
