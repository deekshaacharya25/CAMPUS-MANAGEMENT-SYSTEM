import { Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import profileModel from "../../models/profileModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";

router.put("/add", async (req, res) => {
    try {
        const student_id = req.query.student_id;
        const { 
            rollNo,
            semester,
            dateOfBirth,
            address,
            academicDetails,
            socialLinks,
            skills 
        } = req.body;

        if (!student_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "student_id"));
        }

        // Check if user exists
        const userData = await userModel.findOne({
            _id: student_id,
            isactive: STATE.ACTIVE
        });

        if (!userData) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "student data"));
        }

        // Handle profile updates with nested objects
        const profileUpdates = {};

        if (rollNo) profileUpdates.rollNo = rollNo;
        if (semester) profileUpdates.semester = semester;
        if (dateOfBirth) profileUpdates.dateOfBirth = dateOfBirth;

        if (address) {
            // Ensure address is an object before assigning
            profileUpdates.address = {
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                pincode: address.pincode || ""
            };
        }

        if (academicDetails) {
            // Convert numeric strings to numbers
            if (academicDetails.cgpa) academicDetails.cgpa = parseFloat(academicDetails.cgpa);
            if (academicDetails.backlogCount) academicDetails.backlogCount = parseInt(academicDetails.backlogCount);
            if (academicDetails.admissionYear) academicDetails.admissionYear = parseInt(academicDetails.admissionYear);
            profileUpdates.academicDetails = academicDetails;
        }
        if (socialLinks) profileUpdates.socialLinks = socialLinks;
        if (skills) profileUpdates.skills = skills;

        // Check if the profile already exists
        const existingProfile = await profileModel.findOne({ userId: student_id });

        // Only set address if creating a new profile
        if (!existingProfile && address) {
            profileUpdates.address = address;
        }

        // Update or create profile
        await profileModel.findOneAndUpdate(
            { userId: student_id },
            { $set: profileUpdates },
            { upsert: true, new: true }
        );

        return send(res, RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get student profile
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
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;