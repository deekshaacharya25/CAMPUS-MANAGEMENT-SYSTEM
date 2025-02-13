import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const messageSchema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
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

const messageModel = mongoose.model("messages", messageSchema);
export default messageModel;
