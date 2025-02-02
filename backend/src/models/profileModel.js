import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    semester: {
        type: Number,
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
    designation:{
        type:String,
        trim: true,
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
