import { Router } from "express"
const router = Router();
import eventModel from "../../models/eventModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import { authenticate } from "../../middlewares/authenticate.js";

// Route for listing events with filters
router.get("/", authenticate, async (req, res) => {
    try {
        let title = req.query.title;
        let type = req.query.type;
        let category = req.query.category;
        let event_id = req.query.id;
        let query = { isactive: STATE.ACTIVE };

        if (event_id && event_id != undefined) {
            query = {
                $and: [
                    { isactive: STATE.ACTIVE },
                    { $expr: { $eq: ["$_id", { $toObjectId: event_id }] } }
                ]
            };
        } else {
            if (title != undefined) query.title = title;
            if (type != undefined) query.type = type;
            if (category != undefined) query.category = category;
        }

        let eventData = await eventModel.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    isactive: 0,
                    __v: 0,
                },
            },
        ]);

        if (eventData.length == 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "event Data"));
        }

        // If event_id was provided, return single event
        if (event_id) {
            return send(res, RESPONSE.SUCCESS, eventData[0]);
        }

        return send(res, RESPONSE.SUCCESS, eventData);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;