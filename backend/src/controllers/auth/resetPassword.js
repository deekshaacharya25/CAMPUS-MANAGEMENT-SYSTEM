import { Router } from "express";
import userModel from "../../models/userModel.js";// Adjust the path as necessary
import { RESPONSE } from "../../config/global.js"; // Adjust the path as necessary
import { send, setErrorRes } from "../../helper/responseHelper.js"; // Adjust the path as necessary
import { STATE } from "../../config/constants.js"; // Adjust the path as necessary
import validator from "validator";
import bcrypt from "bcryptjs"; // For hashing passwords

const router = Router();

// Step 1: Verify user by email or phone
router.post("/initiate", async (req, res) => {
    const { username } = req.body; // Get email or phone from request

    // Validate input
    if (!username || (!validator.isEmail(username) && !/^\+91\d{10}$/.test(username))) {
        return send(res, setErrorRes(RESPONSE.REQUIRED, "username"));
    }

    try {
        // Find user by email or phone
        const user = await userModel.findOne({ $or: [{ email: username }, { phone: username }] });
        if (!user) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "User not found"));
        }

        // If user is found, proceed to allow password reset
        return send(res, RESPONSE.SUCCESS, "User verified. Please enter your new password.");
    } catch (error) {
        console.error('Error during user verification:', error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Step 2: Reset password
router.post("/", async (req, res) => {
    const { username, password } = req.body; // Get email/phone and new password from request

    try {
        // Find the user by email or phone
        const user = await userModel.findOne({ $or: [{ email: username }, { phone: username }] });
        if (!user) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "User not found"));
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword; // Update the user's password
        await user.save(); // Save the updated user

        return send(res, RESPONSE.SUCCESS, "Password reset successfully!");
    } catch (error) {
        console.error('Error during password reset:', error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;