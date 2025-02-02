import { Router } from "express";
import mongoose from 'mongoose';
const router = Router();
import userModel from "../../models/userModel.js";
import profileModel from "../../models/profileModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";

router.put("/add", async (req, res) => {
    try {
        const faculty_id = req.query.faculty_id;
        const { 
            dateOfBirth,
            address,
            socialLinks,
            skills,
            designation
        } = req.body;

        if (!faculty_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "faculty_id"));
        }

        // Log the faculty_id
        console.log("Faculty ID:", faculty_id);

        // Check if user exists
        const userData = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(faculty_id),
            isactive: STATE.ACTIVE
        });

        if (!userData) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "Faculty data"));
        }

        // Handle profile updates with nested objects
        const profileUpdates = {};

        // Convert dateOfBirth to a Date object
        if (dateOfBirth) {
            const parts = dateOfBirth.split('-');
            if (parts.length !== 3) {
                console.error("Date format is incorrect:", dateOfBirth);
                return send(res, setErrorRes(RESPONSE.INVALID_DATE, "dateOfBirth"));
            }

            const [year, month, day] = parts; // Adjusted to match YYYY-MM-DD format
            const parsedDate = new Date(`${year}-${month}-${day}`); // Convert to YYYY-MM-DD format
            
            // Check if the parsed date is valid
            if (isNaN(parsedDate.getTime())) {
                console.error("Parsed date is invalid:", parsedDate);
                return send(res, setErrorRes(RESPONSE.INVALID_DATE, "dateOfBirth"));
            }
            profileUpdates.dateOfBirth = parsedDate; // Assign the valid date
        }

        if (address) {
            // Ensure address is an object before assigning
            profileUpdates.address = {
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                pincode: address.pincode || ""
            };
        }

        if (socialLinks) profileUpdates.socialLinks = socialLinks;
        if (skills) profileUpdates.skills = skills;
        if (designation) profileUpdates.designation = designation; 
        
        // Update or create profile
        const updatedProfile = await profileModel.findOneAndUpdate(
            { userId: faculty_id },
            { $set: profileUpdates },
            { upsert: true, new: true }
        );

        if (!updatedProfile) {
            return send(res, setErrorRes(RESPONSE.UNKNOWN_ERR, "Profile update failed"));
        }

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.error("Error adding profile:", error); // Log the error
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get faculty profile
router.get("/list", async (req, res) => {
    try {
        const faculty_id = req.query.faculty_id;

        if (!faculty_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "faculty_id"));
        }

        const profile = await profileModel
            .findOne({ userId: faculty_id })
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

export default router;