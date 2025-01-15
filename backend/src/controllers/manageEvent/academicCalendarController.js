import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { RESPONSE, send } from "../../config/response.js";
import eventModel from "../../models/eventModel.js";
import notificationModel from "../../models/notificationModel.js";
import { STATE } from "../../config/constants.js";

const router = express.Router();

// Get academic calendar events
router.get("/", authenticate, async (req, res) => {
    try {
        const { category, semester, page = 1, limit = 10 } = req.query;

        let query = {
            type: 'ACADEMIC',
            isactive: STATE.ACTIVE
        };

        if (category) query.category = category;
        if (semester) query.semester = semester;

        const total = await eventModel.countDocuments(query);

        const events = await eventModel
            .find(query)
            .sort({ start_date: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('created_by', 'name email');

        return send(res, RESPONSE.SUCCESS, {
            events,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get upcoming academic events
router.get("/upcoming", authenticate, async (req, res) => {
    try {
        const events = await eventModel
            .find({
                type: 'ACADEMIC',
                isactive: STATE.ACTIVE,
                start_date: { $gte: new Date() }
            })
            .sort({ start_date: 1 })
            .limit(5)
            .populate('created_by', 'name email');

        return send(res, RESPONSE.SUCCESS, events);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get upcoming deadlines and notifications
router.get("/notifications", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Get upcoming events
        const upcomingEvents = await eventModel.find({
            type: 'ACADEMIC',
            isactive: STATE.ACTIVE,
            start_date: {
                $gte: today,
                $lte: nextWeek
            }
        });

        // Create notifications for new events
        for (const event of upcomingEvents) {
            // Check if notification already exists
            const existingNotification = await notificationModel.findOne({
                user_id: userId,
                event_id: event._id
            });

            if (!existingNotification) {
                // Create new notification
                await notificationModel.create({
                    user_id: userId,
                    event_id: event._id,
                    title: `Upcoming: ${event.title}`,
                    message: `You have an upcoming ${event.category.toLowerCase()}: ${event.title} on ${event.start_date.toLocaleDateString()}`,
                    type: event.category === 'DEADLINE' ? 'DEADLINE' : 'EVENT'
                });
            }
        }

        // Get all unread notifications for user
        const notifications = await notificationModel
            .find({
                user_id: userId,
                isRead: false,
                isactive: STATE.ACTIVE
            })
            .populate('event_id')
            .sort({ createdAt: -1 });

        return send(res, RESPONSE.SUCCESS, notifications);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Mark notification as read
router.put("/notifications/:id/read", authenticate, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;

        const notification = await notificationModel.findOneAndUpdate(
            {
                _id: notificationId,
                user_id: userId
            },
            {
                isRead: true
            },
            { new: true }
        );

        return send(res, RESPONSE.SUCCESS, notification);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get notification count
router.get("/notifications/count", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await notificationModel.countDocuments({
            user_id: userId,
            isRead: false,
            isactive: STATE.ACTIVE
        });

        return send(res, RESPONSE.SUCCESS, { count });

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Clear all notifications
router.delete("/notifications/clear", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        await notificationModel.updateMany(
            {
                user_id: userId,
                isRead: false,
                isactive: STATE.ACTIVE
            },
            {
                isRead: true
            }
        );

        return send(res, RESPONSE.SUCCESS);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;
