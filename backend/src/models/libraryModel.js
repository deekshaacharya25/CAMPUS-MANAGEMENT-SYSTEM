import mongoose from "mongoose";
import { STATE } from "../config/constants.js";

const librarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    trim: true,
    default: "General"
  },
  description: {
    type: String,
    trim: true
  },
  added_by: {
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
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
librarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const libraryModel = mongoose.model("library", librarySchema);

export default libraryModel;
