// updateProfile.js
import { Router } from "express";
const router = Router();

import userModel from "../../models/userModel.js";
import profileModel from "../../models/profileModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE, ROLE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
    try {
        let user_id = req.query.user_id;
        let { 
            email, 
            phone, 
            role,
            // Profile fields
            department,
            rollNo,
            semester,
            dateOfBirth,
            address,
            academicDetails,
            socialLinks,
            skills 
        } = req.body;

        if (!user_id || user_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "user_id"));
        }

        if (!role || role == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "role"));
        }

        // Check if user exists
        let userData = await userModel.findOne({
            _id: user_id,
            isactive: STATE.ACTIVE
        });

        if (!userData) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "user data"));
        }

        // Handle user model updates
        let userUpdates = {};

        if (email && email != undefined) {
            if (!validator.isEmail(email)) {
                return send(res, setErrorRes(RESPONSE.INVALID, "email format"));
            }
            userUpdates.email = email;
        }

        if (phone && phone != undefined) {
            let isValidPhone = phone.toString().match(/^\+91\d{10}$/);
            if (!isValidPhone) {
                return send(res, setErrorRes(RESPONSE.INVALID, "phone format"));
            }
            userUpdates.phone = phone;
        }

        // Update user model if there are changes
        if (Object.keys(userUpdates).length > 0) {
            await userModel.updateOne(
                { _id: user_id },
                { $set: userUpdates }
            );
        }

        // Handle profile updates based on role
        let profileUpdates = {};

        // Common profile fields for all roles
        if (department) profileUpdates.department = department;
        if (dateOfBirth) profileUpdates.dateOfBirth = dateOfBirth;
        if (address) profileUpdates.address = address;
        if (socialLinks) profileUpdates.socialLinks = socialLinks;
        if (skills) profileUpdates.skills = skills;

        // Student-specific fields
        if (role === ROLE.STUDENT) {
            if (rollNo) profileUpdates.rollNo = rollNo;
            if (semester) profileUpdates.semester = semester;
            if (academicDetails) profileUpdates.academicDetails = academicDetails;
        }

        // Update or create profile
        if (Object.keys(profileUpdates).length > 0) {
            await profileModel.findOneAndUpdate(
                { userId: user_id },
                { 
                    $set: {
                        ...profileUpdates,
                        userId: user_id // Ensure userId is set for new profiles
                    }
                },
                { upsert: true, new: true }
            );
        }

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Add GET endpoint to fetch complete profile
router.get("/", async (req, res) => {
    try {
        let user_id = req.query.user_id;

        if (!user_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "user_id"));
        }

        // Fetch user profile with populated user data
        const profile = await profileModel
            .findOne({ userId: user_id })
            .populate('userId', 'name email phone image role');

        if (!profile) {
            // If no profile exists, return just the user data
            const userData = await userModel.findOne({ _id: user_id, isactive: STATE.ACTIVE });
            if (!userData) {
                return send(res, setErrorRes(RESPONSE.NOT_FOUND, "user data"));
            }
            return send(res, RESPONSE.SUCCESS, userData);
        }

        return send(res, RESPONSE.SUCCESS, profile);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;