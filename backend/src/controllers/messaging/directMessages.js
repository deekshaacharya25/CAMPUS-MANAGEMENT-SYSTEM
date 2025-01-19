import express from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import messageModel from "../../models/messageModel.js";
import { STATE } from "../../config/constants.js";
import mongoose from "mongoose";
const router = express.Router();

// Send a direct message
router.post("/send", authenticate, async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        const sender_id = req.user.id;

        if (!receiver_id || !content) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "receiver and content"));
        }

        const newMessage = await messageModel.create({
            sender_id,
            receiver_id,
            content,
            isRead: false
        });

        return send(res, RESPONSE.SUCCESS, newMessage);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});


// Get conversation with specific user
router.get("/conversation", authenticate, async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId || userId == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "userId"));
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "userId"));
        }

        const messages = await messageModel.find({
            $or: [
                { sender_id: req.user.id, receiver_id: userId },
                { sender_id: userId, receiver_id: req.user.id }
            ],
            isactive: STATE.ACTIVE
        })
        .sort({ createdAt: 1 })
        .populate('sender_id', 'name email')
        .populate('receiver_id', 'name email');

        return send(res, RESPONSE.SUCCESS, messages);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get all conversations list
router.get("/conversations", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const conversations = await messageModel.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: new mongoose.Types.ObjectId(userId) },
                        { receiver_id: new mongoose.Types.ObjectId(userId) }
                    ],
                    isactive: STATE.ACTIVE
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender_id", new mongoose.Types.ObjectId(userId)] },
                            "$receiver_id",
                            "$sender_id"
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            { $skip: (page - 1) * limit },
            { $limit: parseInt(limit) }
        ]);

        return send(res, RESPONSE.SUCCESS, conversations);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});


// Mark message as read
router.put("/read", authenticate, async (req, res) => {
    try {
        const { message_id } = req.query;

        if (!message_id || message_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "message_id"));
        }

        if (!mongoose.Types.ObjectId.isValid(message_id)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "message_id"));
        }

        // Find and update the message
        const message = await messageModel.findOne({
            _id: message_id,
            receiver_id: req.user.id,  // Ensure the current user is the receiver
            isactive: STATE.ACTIVE
        });

        if (!message) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "message"));
        }

        // Update isRead status
        message.isRead = true;
        await message.save();

        return send(res, RESPONSE.SUCCESS);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router; 