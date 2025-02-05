import cron from 'node-cron';
import eventModel from '../../models/eventModel.js';  
import notificationModel from '../../models/notificationModel.js';  
import userModel from '../../models/userModel.js'; 
import { STATE } from '../../config/constants.js';
import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { send } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";

const router = Router();

// Cron job that runs at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        await checkUpcomingEvents();
        console.log('Notification cron job completed successfully');
    } catch (error) {
        console.error('Error in notification cron job:', error);
    }
});

// Test endpoint
router.post("/test", authenticate, async (req, res) => {
    try {
        await checkUpcomingEvents();
        return send(res, RESPONSE.SUCCESS, {
            message: 'Notification check completed successfully'
        });
    } catch (error) {
        console.error('Error:', error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// API endpoint to fetch notifications for the logged-in user
router.get("/list", authenticate, async (req, res) => {
    try {
        const user_id = req.user.id;
        const notifications = await notificationModel.find({ user_id: user_id, isactive: STATE.ACTIVE });
        return send(res, RESPONSE.SUCCESS, notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Function to check upcoming events and create notifications
async function checkUpcomingEvents() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcomingEvents = await eventModel.find({
        isactive: STATE.ACTIVE,
        start_date: {
            $gte: today,
            $lte: nextWeek
        }
    });

    const users = await userModel.find({ isactive: STATE.ACTIVE });

    for (const user of users) {
        for (const event of upcomingEvents) {
            const existingNotification = await notificationModel.findOne({
                user_id: user._id,
                event_id: event._id
            });

            if (!existingNotification) {
                await notificationModel.create({
                    user_id: user._id,
                    event_id: event._id,
                    title: `Upcoming: ${event.title}`,
                    message: `You have an upcoming ${event.type.toLowerCase()} event: ${event.title} on ${event.start_date.toLocaleDateString()}`,
                    type: 'event'
                });
            }
        }
    }
}

export default router;
