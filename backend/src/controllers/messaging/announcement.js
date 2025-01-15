import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { RESPONSE, send, setErrorRes } from "../../config/response.js";
import announcementModel from "../../models/announcementModel.js";
import { STATE, ROLE } from "../../config/constants.js";

const router = express.Router();

// Create announcement
router.post("/create", authenticate, async (req, res) => {
    try {
        // Only admin and faculty can create announcements
        if (![ROLE.ADMIN, ROLE.FACULTY].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const {
            title,
            content,
            recipients,
            department_id,
            course_id,
            student_ids
        } = req.body;

        if (!title || !content || !recipients) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "title, content and recipients"));
        }

        // Create announcement
        const announcement = await announcementModel.create({
            title,
            content,
            sender_id: req.user.id,
            recipients,
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

        // Build query based on user's role and affiliations
        let query = {
            isactive: STATE.ACTIVE,
            $or: [
                { recipients: 'ALL' },
                { student_ids: userId }
            ]
        };

        // If user has department_id or course_id, include those announcements
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

// Get announcements (for faculty/admin)
router.get("/sent", authenticate, async (req, res) => {
    try {
        if (![ROLE.ADMIN, ROLE.FACULTY].includes(req.user.role)) {
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
router.delete("/:id", authenticate, async (req, res) => {
    try {
        if (![ROLE.ADMIN, ROLE.FACULTY].includes(req.user.role)) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const announcement = await announcementModel.findOne({
            _id: req.params.id,
            sender_id: req.user.id
        });

        if (!announcement) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "announcement"));
        }

        announcement.isactive = STATE.DELETED;
        await announcement.save();

        return send(res, RESPONSE.SUCCESS);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;