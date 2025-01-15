import { Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
    try {
        let student_id = req.query.student_id;
        let { name, email, phone } = req.body;
        let updates = {};

        if (!student_id || student_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "student_id"));
        }

        let userData = await userModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ["$_id", { $toObjectId: student_id }] },
                    isactive: STATE.ACTIVE,
                }
            }
        ]);

        if (userData.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "student data"));
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

        await userModel.updateMany(
            { _id: student_id },
            { $set: updates }
        );

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;