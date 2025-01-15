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
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  available_quantity: {
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
    ref: 'User',
    required: true
  },
  borrowers: [{
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    borrowed_date: {
      type: Date,
      default: Date.now
    },
    due_date: {
      type: Date,
      required: true
    },
    return_date: {
      type: Date
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed'
    }
  }],
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

// Add index for faster queries
librarySchema.index({ isbn: 1 });
librarySchema.index({ title: 1 });
librarySchema.index({ author: 1 });

// Update the updatedAt timestamp before saving
librarySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const libraryModel = mongoose.model("Library", librarySchema);

export default libraryModel;
