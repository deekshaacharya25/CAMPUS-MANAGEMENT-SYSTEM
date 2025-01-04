import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    organizer: {
        type: String,
        required: true,
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
});

export default mongoose.model("events", eventSchema);
