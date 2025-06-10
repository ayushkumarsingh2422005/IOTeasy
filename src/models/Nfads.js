import mongoose from "mongoose";

// Nutrient Flow Automation & Dosing System [NFADS]	
// Water Temperature Sensor (DS18B20) 	float
// 2		PH Sensor	float
// 3		TDS sensor 	integer
// 4		EC sensor	integer
// 5		Peristaltic pump_A	boolean
// 6		Peristaltic pump_B	boolean
// 7		Peristaltic pump_pHUp	boolean
// 8		Peristaltic pump_pHDown	boolean
// 9		Water pump	boolean
// 10		Solenoid valve	boolean
// 11		Peltier Module	boolean
// 12		Compressor Module	boolean
// 13		OLED Display	boolean
// 14		Water Flow Meter	float

const NfadsSchema = new mongoose.Schema({
    compressor: {
        type: Boolean, //
    },
    ec: {
        type: Number, //
    },
    oled: {
        type: Boolean, //
    },
    peltier: {
        type: Boolean, //
    },
    peristalticPumpA: {
        type: Boolean, //
    },
    peristalticPumpB: {
        type: Boolean, //
    },
    peristalticPumpPhdown: {
        type: Boolean, //
    },
    peristalticPumpPhup: {
        type: Boolean, //
    },
    ph: {
        type: Number, //
    },
    solenoidValve: {
        type: Boolean, //
    },
    tds: {
        type: Number, //
    },
    waterFlow: {
        type: Boolean, //
    },
    waterPump: {
        type: Boolean, //
    },
    waterTemp: {
        type: Number, //
    }
}, { timestamps: true });

export default mongoose.models.Nfads || mongoose.model("Nfads", NfadsSchema);
