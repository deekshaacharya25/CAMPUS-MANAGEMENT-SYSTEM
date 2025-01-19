import express from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import announcementModel from "../../models/announcementModel.js";
import { STATE, ROLE } from "../../config/constants.js";
import mongoose from "mongoose";

const router = express.Router();

// Create announcement
router.post("/create", authenticate, async (req, res) => {
    try {
        if (req.user.role !== ROLE.TEACHER) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const { title, content, recipients, department_id, course_id, student_ids } = req.body;

        if (!title || !content) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "title and content"));
        }

        const announcement = await announcementModel.create({
            title,
            content,
            sender_id: req.user.id,
            recipients: recipients || 'ALL',
            department_id,
            course_id,
            student_ids,
            isactive: STATE.ACTIVE
        });

        return send(res, RESPONSE.SUCCESS, announcement);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get announcements (for students)
router.get("/", authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;

        let query = {
            isactive: STATE.ACTIVE,
            $or: [
                { recipients: 'ALL' },
                { student_ids: userId }
            ]
        };

        if (req.user.department_id) {
            query.$or.push({ 
                recipients: 'DEPARTMENT',
                department_id: req.user.department_id
            });
        }

        if (req.user.course_id) {
            query.$or.push({
                recipients: 'COURSE',
                course_id: req.user.course_id
            });
        }

        const total = await announcementModel.countDocuments(query);

        const announcements = await announcementModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('sender_id', 'name email role');

        return send(res, RESPONSE.SUCCESS, {
            announcements,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get sent announcements (for TEACHER/admin)
router.get("/sent", authenticate, async (req, res) => {
    try {
        if (![ROLE.ADMIN, ROLE.TEACHER].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const { page = 1, limit = 10 } = req.query;

        const query = {
            sender_id: req.user.id,
            isactive: STATE.ACTIVE
        };

        const total = await announcementModel.countDocuments(query);

        const announcements = await announcementModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('department_id', 'name')
            .populate('course_id', 'title')
            .populate('student_ids', 'name email');

        return send(res, RESPONSE.SUCCESS, {
            announcements,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Delete announcement
router.delete("/delete", authenticate, async (req, res) => {
    try {
        if (![ROLE.ADMIN, ROLE.TEACHER].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        let announcement_id = req.query.announcement_id;

        console.log("Announcement ID:", announcement_id);
        console.log("User ID:", req.user.id);

        if (!announcement_id || announcement_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "announcement_id"));
        }

        if (!mongoose.Types.ObjectId.isValid(announcement_id)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "announcement_id"));
        }

        const objectId = new mongoose.Types.ObjectId(announcement_id);
        
        let checkAnnouncement = await announcementModel.findOne({
            _id: objectId,
            isactive: STATE.ACTIVE
        });
        
        console.log("Found announcement:", checkAnnouncement);

        let announcementData = await announcementModel.aggregate([
            {
                $match: {
                    $expr: { $eq: ["$_id", objectId] },
                    isactive: STATE.ACTIVE,
                    sender_id: new mongoose.Types.ObjectId(req.user.id)  // Convert user ID to ObjectId
                }
            }
        ]);

        if (announcementData.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "announcement"));
        }

        await announcementModel.deleteOne({
            _id: announcement_id
        });

        return send(res, RESPONSE.SUCCESS);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;