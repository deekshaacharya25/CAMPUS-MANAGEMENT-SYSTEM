import { Router } from "express";
import mongoose from 'mongoose';
const router = Router();
import userModel from "../../models/userModel.js";
import profileModel from "../../models/profileModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";

router.put("/add", async (req, res) => {
    console.log("Received profile update request:");
    console.log("Query params:", req.query);
    console.log("Request body:", req.body);
    
    try {
        const student_id = req.query.student_id;
        
        if (!student_id) {
            console.log("Missing student_id");
            return send(res, setErrorRes(RESPONSE.REQUIRED, "student_id"));
        }

        // Check if user exists
        const userData = await userModel.findOne({
            _id: new mongoose.Types.ObjectId(student_id),
            isactive: STATE.ACTIVE
        });

        if (!userData) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "student data"));
        }

        // Create update object with explicit type conversion
        const profileUpdates = {
            semester: req.body.semester,
            dateOfBirth: new Date(req.body.dateOfBirth),
            address: {
                street: req.body.address?.street || "",
                city: req.body.address?.city || "",
                state: req.body.address?.state || "",
                pincode: req.body.address?.pincode || ""
            },
            academicDetails: {
                cgpa: Number(req.body.academicDetails?.cgpa) || 0,
                backlogCount: Number(req.body.academicDetails?.backlogCount) || 0,
                admissionYear: Number(req.body.academicDetails?.admissionYear) || 0
            },
            socialLinks: {
                linkedin: req.body.socialLinks?.linkedin || "",
                github: req.body.socialLinks?.github || "",
                portfolio: req.body.socialLinks?.portfolio || ""
            },
            skills: Array.isArray(req.body.skills) ? req.body.skills : [],
            department: req.body.department,
            userId: student_id // Make sure to include the userId
        };

        console.log("Processed profile updates:", profileUpdates);

        // Update the profile with upsert
        const updatedProfile = await profileModel.findOneAndUpdate(
            { userId: student_id },
            { $set: profileUpdates },
            { upsert: true, new: true, runValidators: true }
        );

        console.log("Updated profile result:", updatedProfile);

        if (!updatedProfile) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "Failed to update profile"));
        }

        return send(res, RESPONSE.SUCCESS, updatedProfile);
    } catch (error) {
        console.error("Error in profile update:", error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

router.get("/list", async (req, res) => {
    try {
        const student_id = req.query.student_id;

        if (!student_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "student_id"));
        }

        const profile = await profileModel
            .findOne({ userId: student_id })
            .populate('userId', 'name email phone image role');

        if (!profile) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "student profile"));
        }

        return send(res, RESPONSE.SUCCESS, profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;