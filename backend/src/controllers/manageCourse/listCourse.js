import { response, Router } from "express";
const router = Router();
import courseModel from "../../models/courseModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import { authenticate } from "../../middlewares/authenticate.js";

// Existing route for listing courses with various query parameters
router.get("/", authenticate, async (req, res) => {
    try {
        let title = req.query.title;
        let course_id = req.query.course_id;
        let facultyId = req.query.facultyId;
        let query = {};

        if (title) query.title = title;
        if (course_id) query.$expr = { $eq: ["$_id", { $toObjectId: course_id }] };
        if (facultyId) query.facultyId = facultyId;

        console.log("Query:", query);
        let courseData = await courseModel.aggregate([
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

        console.log("Course Data:", courseData);

        if (courseData.length == 0) {
            return setErrorRes(res, RESPONSE.NOT_FOUND, "course Data");
        }

        return send(res, RESPONSE.SUCCESS, courseData);
    } catch (error) {
        console.error("Error:", error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

router.get("/by-faculty", authenticate, async (req, res) => {
    try {
        const facultyId = req.query.facultyId;
        console.log(`Fetching courses for facultyId: ${facultyId}`);
        let courseData = await courseModel.find({ facultyId }).select('-isactive -__v');
        console.log("Course Data:", courseData);

        if (courseData.length == 0) {
            return setErrorRes(res, RESPONSE.NOT_FOUND, "course Data");
        }

        return send(res, RESPONSE.SUCCESS, courseData);
    } catch (error) {
        console.error("Error:", error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;