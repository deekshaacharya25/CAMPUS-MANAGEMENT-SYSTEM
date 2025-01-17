import { Router } from "express"
const router = Router();
import eventModel from "../../models/eventModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE, ROLE } from "../../config/constants.js";
import mongoose from "mongoose";
import { authenticate } from "../../middlewares/authenticate.js";

router.delete("/", authenticate, async (req, res) => {
    try {
        if (![ROLE.ADMIN, ROLE.TEACHER].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        let event_id = req.query.event_id;

        if (!event_id || event_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "event_id"));
        }

        if (!mongoose.Types.ObjectId.isValid(event_id)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "event_id"));
        }

        const objectId = new mongoose.Types.ObjectId(event_id);
        let eventData = await eventModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ["$_id", objectId] },
                    isactive: STATE.ACTIVE,
                },
            },
        ]);

        if (eventData.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "event data"));
        }

        console.log(eventData);

        // Only creator or admin can delete
        if (eventData[0].created_by.toString() !== req.user.id && req.user.role !== ROLE.ADMIN) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }


        await eventModel.deleteOne({ _id: event_id });

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;