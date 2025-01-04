import mongoose from "mongoose";
import { Schema } from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    faculty_id: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "users", 
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("courses", courseSchema);
