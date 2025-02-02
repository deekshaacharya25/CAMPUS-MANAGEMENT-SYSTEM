import { Router } from "express";
const router = Router();
import eventModel from "../../models/eventModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE, ROLE } from "../../config/constants.js";
import { authenticate } from "../../middlewares/authenticate.js";

router.put("/", authenticate, async (req, res) => {
    try {
        // Check if user is admin or teacher
        if (![ROLE.ADMIN, ROLE.TEACHER].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        let event_id = req.query.event_id;
        let { title, description, start_date, end_date, venue, type, category } = req.body;
        let updates = {};

        if (!event_id || event_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "event_id"));
        }

        // Find the event and check if creator
        const event = await eventModel.findById(event_id);
        if (!event) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "event"));
        }

        // Only creator or admin can edit
        if (event.created_by.toString() !== req.user.id && req.user.role !== ROLE.ADMIN && req.user.role !== ROLE.TEACHER) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        let eventData = await eventModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ["$_id", { $toObjectId: event_id }] },
                    isactive: STATE.ACTIVE,
                },
            },
        ]);

        if (eventData.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "event data"));
        }

        console.log(eventData);

        if (title && title != undefined) {
            updates.title = title;
        }
        if (description && description != undefined) {
            updates.description = description;
        }
        if (start_date && start_date != undefined) {
            updates.start_date = new Date(start_date);
        }
        if (end_date && end_date != undefined) {
            updates.end_date = new Date(end_date);
        }
        if (venue && venue != undefined) {
            updates.venue = venue;
        }
        if (type && type != undefined) {
            updates.type = type;
        }
        if (category && category != undefined) {
            updates.category = category;
        }

        await eventModel.updateMany(
            {
                _id: event_id,
            },
            {
                $set: updates,
            }
        );

        console.log(updates);

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;