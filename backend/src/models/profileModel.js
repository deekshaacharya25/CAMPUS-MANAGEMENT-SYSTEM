import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
        match: /^[A-Z]{2}\d{2}[A-Z]\d{3}$/
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    academicDetails: {
        cgpa: Number,
        backlogCount: Number,
        admissionYear: Number
    },
    socialLinks: {
        linkedin: String,
        github: String,
        portfolio: String
    },
    skills: {
        type: [String],
        default: []
    },
    isactive: {
        type: Number,
        default: 1,
        enum: [0, 1]
    }
}, {
    timestamps: true
});


const profileModel = mongoose.model("Profile", profileSchema);
export default profileModel;
