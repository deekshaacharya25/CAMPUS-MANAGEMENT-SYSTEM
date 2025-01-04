import mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("messages", messageSchema);
