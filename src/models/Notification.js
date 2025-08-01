import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    module: {
        type: String,
        enum: ['NFADS', 'LMS', 'EMS'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    sensorType: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
