import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { RESPONSE, send } from "../../config/response.js";
import eventModel from "../../models/eventModel.js";
import { STATE } from "../../config/constants.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
        const { type, category, start_date, end_date, page = 1, limit = 10 } = req.query;

        // Build query
        let query = { isactive: STATE.ACTIVE };
        if (type) query.type = type;
        if (category) query.category = category;
        if (start_date || end_date) {
            query.start_date = {};
            if (start_date) query.start_date.$gte = new Date(start_date);
            if (end_date) query.start_date.$lte = new Date(end_date);
        }

        // Get total count
        const total = await eventModel.countDocuments(query);

        // Get events with pagination
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

export default router;