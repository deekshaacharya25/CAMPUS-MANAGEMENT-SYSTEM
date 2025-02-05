import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date
    },
    venue: {
        type: String,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['ACADEMIC', 'CAMPUS'],
        uppercase: true
    },
    category: {
        type: String,
        uppercase: true,
        validate: {
            validator: function(value) {
                if (this.type === 'ACADEMIC') {
                    return ['EXAM', 'HOLIDAY', 'ASSIGNMENT', 'LECTURE'].includes(value);
                }
                return ['CULTURAL', 'SPORTS', 'WORKSHOP', 'SEMINAR'].includes(value);
            },
            message: 'Invalid category for the selected event type'
        }
    },
    created_by: {
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

const eventModel = mongoose.model("Event", eventSchema);

export default eventModel;
