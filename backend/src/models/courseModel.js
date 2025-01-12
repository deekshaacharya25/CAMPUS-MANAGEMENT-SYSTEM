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
    facultyId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "users" },
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
    isactive: {
        type: Number,
        default: 1,
    },
});

export default mongoose.model("courses", courseSchema);
