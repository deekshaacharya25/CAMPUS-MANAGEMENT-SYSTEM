// facultyProfile.js
import { Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import courseModel from "../../models/courseModel.js";
import departmentModel from "../../models/departmentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
    try {
        let facultyId = req.query.facultyId;
        let { name, email, phone, department } = req.body;
        let updates = {};

        if (!facultyId || facultyId == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        let userData = await userModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ["$_id", { $toObjectId: facultyId }] },
                    isactive: STATE.ACTIVE,
                }
            }
        ]);

        if (userData.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "faculty data"));
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

        if (department && department != undefined) {
            updates.department = department;
        }

        await userModel.updateMany(
            { _id: facultyId },
            { $set: updates }
        );

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

router.get("/courses", async (req, res) => {
    try {
        let facultyId = req.query.facultyId;

        if (!facultyId || facultyId == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        console.log('Searching for facultyId:', facultyId);

        let courses = await courseModel.find({
            facultyId: facultyId,
            isactive: STATE.ACTIVE
        });

        console.log('Found courses:', courses);

        let allCourses = await courseModel.find({});
        console.log('All courses in DB:', allCourses);

        return send(res, RESPONSE.SUCCESS, courses);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

router.get("/departments", async (req, res) => {
    try {
        let facultyId = req.query.facultyId;

        if (!facultyId || facultyId == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        let departments = await departmentModel.find({
            faculties: facultyId,
            isactive: STATE.ACTIVE
        });

        if (departments.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "departments data"));
        }

        return send(res, RESPONSE.SUCCESS, departments);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;