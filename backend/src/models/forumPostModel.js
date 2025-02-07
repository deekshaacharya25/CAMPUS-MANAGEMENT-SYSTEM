import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const forumPostSchema = new mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    caption: {
        type: String,
        required: true,
        trim: true
    },
    images: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        required: true,
        enum: ['General', 'Academic', 'Events', 'Announcements']
    },
    comments: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        caption: {
            type: String,
        },
        image: {
            type: String,
            trim: true
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