import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['EVENT', 'DEADLINE', 'REMINDER'],
        default: 'EVENT'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isactive: {
        type: Number,
        default: STATE.ACTIVE
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const notificationModel = mongoose.model("Notification", notificationSchema);
export default notificationModel;
