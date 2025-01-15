import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { RESPONSE, send, setErrorRes } from "../../config/response.js";
import eventModel from "../../models/eventModel.js";
import { ROLE } from "../../config/constants.js";

const router = express.Router();

router.put("/:id", authenticate, async (req, res) => {
    try {
        // Only admin and faculty can edit events
        if (![ROLE.ADMIN, ROLE.FACULTY].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const eventId = req.params.id;
        const {
            title,
            description,
            start_date,
            end_date,
            venue,
            type,
            category
        } = req.body;

        // Check if event exists
        const event = await eventModel.findById(eventId);
        if (!event) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "event"));
        }

        // Only creator or admin can edit
        if (event.created_by.toString() !== req.user.id && req.user.role !== ROLE.ADMIN) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        // Update event
        const updatedEvent = await eventModel.findByIdAndUpdate(
            eventId,
            {
                title,
                description,
                start_date: start_date ? new Date(start_date) : event.start_date,
                end_date: end_date ? new Date(end_date) : event.end_date,
                venue,
                type,
                category,
                updated_at: new Date()
            },
            { new: true }
        );

        return send(res, RESPONSE.SUCCESS, updatedEvent);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;