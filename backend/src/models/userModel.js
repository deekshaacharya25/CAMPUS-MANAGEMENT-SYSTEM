import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        required: true,
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId,
         ref: "users" },
    image: { 
        type: Array, 
        default: [] 
    },
    facultyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",
    },
    isactive: {
        type: Number,
        default: 1,
    },
});

export default mongoose.model("users", userSchema);
