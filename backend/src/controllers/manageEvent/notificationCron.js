import cron from 'node-cron';
import eventModel from '../../models/eventModel.js';  
import notificationModel from '../../models/notificationModel.js';  
import userModel from '../../models/userModel.js'; 
import { STATE } from '../../config/constants.js';  

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Get all upcoming events
        const upcomingEvents = await eventModel.find({
            type: 'ACADEMIC',
            isactive: STATE.ACTIVE,
            start_date: {
                $gte: today,
                $lte: nextWeek
            }
        });

        // Get all active users
        const users = await userModel.find({ isactive: STATE.ACTIVE });

        // Create notifications for each user
        for (const user of users) {
            for (const event of upcomingEvents) {
                // Check if notification already exists
                const existingNotification = await notificationModel.findOne({
                    user_id: user._id,
                    event_id: event._id
                });

                if (!existingNotification) {
                    // Create new notification
                    await notificationModel.create({
                        user_id: user._id,
                        event_id: event._id,
                        title: `Upcoming: ${event.title}`,
                        message: `You have an upcoming ${event.category.toLowerCase()}: ${event.title} on ${event.start_date.toLocaleDateString()}`,
                        type: event.category === 'DEADLINE' ? 'DEADLINE' : 'EVENT'
                    });
                }
            }
        }

        console.log('Notification cron job completed successfully');
    } catch (error) {
        console.error('Error in notification cron job:', error);
    }
});
