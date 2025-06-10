import mongoose from "mongoose";

const EmsSchema = new mongoose.Schema({
    carbonDioxide: {
        type: Number,
    },
    dht22Moisture: {
        type: Number,
    },
    dht22Temp: {
        type: Number,
    },
    oxygen: {
        type: Number,
    },
    pressure: {
        type: Number,
    },
    exhaustFan: {
        type: Boolean,
    },
    indoorCooling: {
        type: Boolean,
    },
    oled: {
        type: Boolean,
    },
    diaphragmPump: {
        type: Boolean,
    }
}, { timestamps: true });

export default mongoose.models.Ems || mongoose.model("Ems", EmsSchema);
