import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const courseMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    file_url: {
        type: String,
        required: true
    },
    file_type: {
        type: String,
        required: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
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

const courseMaterialModel = mongoose.model("CourseMaterial", courseMaterialSchema);
export default courseMaterialModel; 