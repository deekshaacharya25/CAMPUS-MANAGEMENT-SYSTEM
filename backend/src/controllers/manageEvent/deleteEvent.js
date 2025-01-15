import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { RESPONSE, send, setErrorRes } from "../../config/response.js";
import eventModel from "../../models/eventModel.js";
import { STATE, ROLE } from "../../config/constants.js";

const router = express.Router();

router.delete("/:id", authenticate, async (req, res) => {
    try {
        // Only admin and faculty can delete events
        if (![ROLE.ADMIN, ROLE.FACULTY].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const eventId = req.params.id;

        // Check if event exists
        const event = await eventModel.findById(eventId);
        if (!event) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "event"));
        }

        // Only creator or admin can delete
        if (event.created_by.toString() !== req.user.id && req.user.role !== ROLE.ADMIN) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        // Soft delete the event
        await eventModel.findByIdAndUpdate(eventId, {
            isactive: STATE.DELETED
        });

        return send(res, RESPONSE.SUCCESS);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;