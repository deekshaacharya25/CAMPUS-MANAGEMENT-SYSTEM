// updateProfile.js
import { Router } from "express";
const router = Router();

import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE, ROLE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
    try {
        let user_id = req.query.user_id;
        let { name, email, phone, role, department } = req.body;
        let updates = {};

        if (!user_id || user_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "user_id"));
        }

        if (!role || role == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "role"));
        }

        let userData = await userModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ["$_id", { $toObjectId: user_id }] },
                    isactive: STATE.ACTIVE,
                }
            }
        ]);

        if (userData.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "user data"));
        }

        if (name && name != undefined) {
            updates.name = name;
        }

        if (email && email != undefined) {
            if (!validator.isEmail(email)) {
                return send(res, setErrorRes(RESPONSE.INVALID, "email format"));
            }
            updates.email = email;
        }

        if (phone && phone != undefined) {
            let isValidPhone = phone.toString().match(/^\+91\d{10}$/);
            if (!isValidPhone) {
                return send(res, setErrorRes(RESPONSE.INVALID, "phone format"));
            }
            updates.phone = phone;
        }

        if (role === ROLE.TEACHER && department != undefined) {
            updates.department = department;
        }

        await userModel.updateMany(
            { _id: user_id },
            { $set: updates }
        );

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;