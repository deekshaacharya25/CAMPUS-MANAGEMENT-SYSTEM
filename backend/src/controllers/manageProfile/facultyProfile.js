// facultyProfile.js
import { Router } from "express";
import userModel from "../../models/userModel.js";
import profileModel from "../../models/profileModel.js";
import courseModel from "../../models/courseModel.js";
import departmentModel from "../../models/departmentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

const router = Router();

// Update faculty profile
router.put("/", async (req, res) => {
    try {
        const facultyId = req.query.facultyId;
        const { email, phone, dateOfBirth, address, socialLinks, skills, department, street, city, state, pincode, linkedin, github, portfolio } = req.body;

        if (!facultyId) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        // Check if faculty exists
        const userData = await userModel.findOne({
            _id: facultyId,
            isactive: STATE.ACTIVE
        });

        if (!userData) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "faculty data"));
        }

        // Validate and update user fields
        const userUpdates = {};
        if (email) {
            if (!validator.isEmail(email)) {
                return send(res, setErrorRes(RESPONSE.INVALID, "email format"));
            }
            userUpdates.email = email;
        }

        if (phone) {
            const isValidPhone = phone.toString().match(/^\+91\d{10}$/);
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
        const profileUpdates = {};

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
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get faculty profile
router.get("/", async (req, res) => {
    try {
        const facultyId = req.query.facultyId;

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
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get courses for a faculty
router.get("/courses", async (req, res) => {
    try {
        const facultyId = req.query.facultyId;

        if (!facultyId) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        console.log('Searching for facultyId:', facultyId);

        const courses = await courseModel.find({
            facultyId: facultyId,
            isactive: STATE.ACTIVE
        });

        console.log('Found courses:', courses);

        return send(res, RESPONSE.SUCCESS, courses);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get departments for a faculty
router.get("/departments", async (req, res) => {
    try {
        const facultyId = req.query.facultyId;

        if (!facultyId) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        const departments = await departmentModel.find({
            faculties: facultyId,
            isactive: STATE.ACTIVE
        });

        if (departments.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "departments data"));
        }

        return send(res, RESPONSE.SUCCESS, departments);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;