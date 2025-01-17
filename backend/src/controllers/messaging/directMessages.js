import express from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import messageModel from "../../models/messageModel.js";
import { STATE } from "../../config/constants.js";

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
router.get("/conversation/:userId", authenticate, async (req, res) => {
    try {
        const currentUser = req.user.id;
        const otherUser = req.params.userId;

        const messages = await messageModel.find({
            $or: [
                { sender_id: currentUser, receiver_id: otherUser },
                { sender_id: otherUser, receiver_id: currentUser }
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
                        { sender_id: userId },
                        { receiver_id: userId }
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
                            { $eq: ["$sender_id", userId] },
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
router.put("/read/:messageId", authenticate, async (req, res) => {
    try {
        const message = await messageModel.findOneAndUpdate(
            {
                _id: req.params.messageId,
                receiver_id: req.user.id
            },
            { isRead: true },
            { new: true }
        );

        return send(res, RESPONSE.SUCCESS, message);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router; 