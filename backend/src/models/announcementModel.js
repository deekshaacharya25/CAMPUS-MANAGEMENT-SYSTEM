import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    recipients: {
        type: String,
        enum: ['ALL', 'DEPARTMENT', 'COURSE', 'SPECIFIC'],
        default: 'ALL'
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'departments'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses'
    },
    student_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    isactive: {
        type: Number,
        default: STATE.ACTIVE
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const announcementModel = mongoose.model("announcements", announcementSchema);
export default announcementModel;
