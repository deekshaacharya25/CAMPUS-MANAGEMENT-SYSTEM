import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    ISBN: {
        type: String,
        unique: true,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    availableCopies: {
        type: Number,
        default: 1,
    },
    borrowedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
        },
    ],
});

export default mongoose.model("library", librarySchema);
