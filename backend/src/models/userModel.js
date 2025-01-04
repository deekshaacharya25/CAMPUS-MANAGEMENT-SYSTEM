import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model("users", userSchema);
