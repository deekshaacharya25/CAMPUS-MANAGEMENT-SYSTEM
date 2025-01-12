import mongoose from "mongoose";
import { Schema } from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    faculties: [
        {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isactive: {
        type: Number,
        default: 1,
    },
});

export default mongoose.model("departments", departmentSchema);
