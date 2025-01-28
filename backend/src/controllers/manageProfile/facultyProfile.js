// facultyProfile.js
import { Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import profileModel from "../../models/profileModel.js";
import courseModel from "../../models/courseModel.js";
import departmentModel from "../../models/departmentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
    try {
        let facultyId = req.query.facultyId;
        let { 
            email, 
            phone,
            department,
            dateOfBirth,
            // Nested objects
            address: {
                street,
                city,
                state,
                pincode
            } = {},
            socialLinks: {
                linkedin,
                github,
                portfolio
            } = {},
            skills 
        } = req.body;

        if (!facultyId) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        // Check if faculty exists
        let userData = await userModel.findOne({
            _id: facultyId,
            isactive: STATE.ACTIVE
        });

        if (!userData) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "faculty data"));
        }

        // Validate and update user fields
        let userUpdates = {};
        if (email) {
            if (!validator.isEmail(email)) {
                return send(res, setErrorRes(RESPONSE.INVALID, "email format"));
            }
            userUpdates.email = email;
        }

        if (phone) {
            let isValidPhone = phone.toString().match(/^\+91\d{10}$/);
            if (!isValidPhone) {
                return send(res, setErrorRes(RESPONSE.INVALID, "phone format"));
            }
            userUpdates.phone = phone;
        }

        // Update user model if needed
        if (Object.keys(userUpdates).length > 0) {
            await userModel.updateOne(
                { _id: facultyId },
                { $set: userUpdates }
            );
        }

        // Handle profile updates with nested objects
        let profileUpdates = {};

        if (department) profileUpdates.department = department;
        if (dateOfBirth) profileUpdates.dateOfBirth = dateOfBirth;

        // Handle address updates
        if (street || city || state || pincode) {
            profileUpdates.address = {
                ...(street && { street }),
                ...(city && { city }),
                ...(state && { state }),
                ...(pincode && { pincode })
            };
        }

        // Handle social links updates
        if (linkedin || github || portfolio) {
            profileUpdates.socialLinks = {
                ...(linkedin && { linkedin }),
                ...(github && { github }),
                ...(portfolio && { portfolio })
            };
        }

        if (skills) profileUpdates.skills = skills;

        // Update or create profile
        await profileModel.findOneAndUpdate(
            { userId: facultyId },
            { $set: profileUpdates },
            { upsert: true, new: true }
        );

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get faculty profile
router.get("/", async (req, res) => {
    try {
        let facultyId = req.query.facultyId;

        if (!facultyId) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        const profile = await profileModel
            .findOne({ userId: facultyId })
            .populate('userId', 'name email phone image role');

        if (!profile) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "faculty profile"));
        }

        return send(res, RESPONSE.SUCCESS, profile);
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