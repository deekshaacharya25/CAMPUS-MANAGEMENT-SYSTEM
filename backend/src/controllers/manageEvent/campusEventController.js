import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { RESPONSE, send } from "../../config/response.js";
import eventModel from "../../models/eventModel.js";
import { STATE } from "../../config/constants.js";

const router = express.Router();

// Get all campus events
router.get("/", authenticate, async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;

        let query = {
            type: 'CAMPUS',
            isactive: STATE.ACTIVE
        };

        if (category) query.category = category;

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

export default router;
