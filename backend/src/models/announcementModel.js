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
        ref: 'User',
        required: true
    },
    recipients: {
        type: String,
        enum: ['ALL', 'DEPARTMENT', 'COURSE', 'SPECIFIC'],
        default: 'ALL'
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    student_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

const announcementModel = mongoose.model("Announcement", announcementSchema);
export default announcementModel;
