import express from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import eventModel from "../../models/eventModel.js";
import { STATE, ROLE } from "../../config/constants.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        // Only admin and faculty can add events
        if (![ROLE.ADMIN, ROLE.TEACHER].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const {
            title,
            description,
            start_date,
            end_date,
            venue,
            type, // 'ACADEMIC' or 'CAMPUS'
            category // For academic: 'EXAM', 'HOLIDAY', etc. For campus: 'CULTURAL', 'SPORTS', etc.
        } = req.body;

        // Validate required fields
        if (!title || !description || !start_date || !type) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "title, description, start_date, and type"));
        }

        // Create new event
        const newEvent = await eventModel.create({
            title,
            description,
            start_date: new Date(start_date),
            end_date: end_date ? new Date(end_date) : null,
            venue,
            type,
            category,
            created_by: req.user.id,
            isactive: STATE.ACTIVE
        });

        return send(res, RESPONSE.SUCCESS, newEvent);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;

