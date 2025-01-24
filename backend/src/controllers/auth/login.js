import { response, Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"; // Import crypto for generating tokens
import nodemailer from "nodemailer"; // Import nodemailer for sending emails

// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email || !validator.isEmail(email)) {
        return send(res, setErrorRes(RESPONSE.REQUIRED, "email"));
    }

    try {
        // Find user by email
        const user = await userModel.findOne({ email, isactive: STATE.ACTIVE });
        if (!user) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "User not found"));
        }

        // Generate a token
        const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour

        await user.save();

        // Send email with the reset link
        sendResetEmail(user.email, token); // Implement this function
        return send(res, RESPONSE.SUCCESS, "Password reset link sent");
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Function to send reset email
const sendResetEmail = (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email service
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // Your email password
        },
    });

    const resetLink = `http://localhost:3000/reset-password/${token}`; // Link to reset password page

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
              `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
              `${resetLink}\n\n` +
              `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
    });
};

// Existing login route
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || username == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "username"));
        }

        if (!password || password == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "password"));
        }

        const normalizedUsername = username.trim().toLowerCase();
        let isEmail = validator.isEmail(normalizedUsername);

        let userData = await userModel.findOne({
            isactive: STATE.ACTIVE,
            $or: [{ phone: normalizedUsername }, { email: normalizedUsername }],
        });

        console.log("Query:", {
            email: normalizedUsername
        });

        console.log("Username:", username);
        console.log("User Data:", userData);

        if (userData && (await bcrypt.compare(password, userData.password))) {
            let token = jwt.sign({
                id: userData._id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role 
            }, process.env.SECRETKEY);
            return send(res, RESPONSE.SUCCESS, token);
        } else {
            return send(res, setErrorRes(RESPONSE.INVALID, "Login Credential"));
        }

    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;