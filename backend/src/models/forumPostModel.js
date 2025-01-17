import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const forumPostSchema = new mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['General', 'Academic', 'Events', 'Announcements']
    },
    comments: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
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

const forumPostModel = mongoose.model("forumPosts", forumPostSchema);
export default forumPostModel; 