import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'events',
        required: true
    },
    type: {
        type: String,
        enum: ['event', 'announcement', 'message'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isactive: {
        type: Number,
        default: STATE.ACTIVE
    }
}, {
    timestamps: true
});

const notificationModel = mongoose.model("notifications", notificationSchema);
export default notificationModel;
