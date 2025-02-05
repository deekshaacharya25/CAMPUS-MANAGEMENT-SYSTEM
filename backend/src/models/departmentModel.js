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

    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: "courses", 
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
