import { Router } from "express";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { material } from "../../middlewares/uploads.js";
import courseMaterialModel from "../../models/courseMaterialModel.js";
import validator from 'validator';
import path from 'path';
const router = Router();

// Route to handle file uploads
router.post("/upload/file", authenticate, material, async (req, res) => {
    try {
        // Only TEACHER can upload
        if (req.user.role !== ROLE.TEACHER) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const { title, description, course_id } = req.body;
        const file = req.file;

        if (!file || !title || !course_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "file, title and course_id"));
        }

        const newMaterial = await courseMaterialModel.create({
            title,
            description,
            type: "file",
            content: `/uploads/course-materials/${file.filename}`,
            file_type: path.extname(file.originalname),
            course_id,
            user_id: req.user.id,
            isactive: STATE.ACTIVE
        });

        return send(res, RESPONSE.SUCCESS, { material: newMaterial });
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Route to handle PDF URL upload
router.post("/upload/pdf", authenticate, async (req, res) => {
    try {
        // Only TEACHER can upload
        if (req.user.role !== ROLE.TEACHER) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const { pdfUrl, title, description, course_id } = req.body;

        if (!pdfUrl || !title || !course_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "pdfUrl, title and course_id"));
        }

        if (!validator.isURL(pdfUrl) || !pdfUrl.endsWith(".pdf")) {
            return send(res, setErrorRes(RESPONSE.INVALID, "pdfUrl"));
        }

        const newMaterial = await courseMaterialModel.create({
            title,
            description,
            type: "pdf",
            content: pdfUrl,
            course_id,
            user_id: req.user.id,
            isactive: STATE.ACTIVE
        });

        return send(res, RESPONSE.SUCCESS, { material: newMaterial });
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Route to handle YouTube video upload
router.post("/upload/video", authenticate, async (req, res) => {
    try {
        // Only TEACHER can upload
        if (req.user.role !== ROLE.TEACHER) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }

        const { videoUrl, title, description, course_id } = req.body;

        if (!videoUrl || !title || !course_id) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "videoUrl, title and course_id"));
        }

        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        if (!youtubeRegex.test(videoUrl)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "videoUrl"));
        }

        const newMaterial = await courseMaterialModel.create({
            title,
            description,
            type: "video",
            content: videoUrl,
            course_id,
            user_id: req.user.id,
            isactive: STATE.ACTIVE
        });

        return send(res, RESPONSE.SUCCESS, { material: newMaterial });
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Route to fetch all materials
router.get("/materials", authenticate, async (req, res) => {
    try {
        const { course_id, type, page = 1, limit = 10 } = req.query;

        let query = { isactive: STATE.ACTIVE };
        if (course_id) query.course_id = course_id;
        if (type) query.type = type;

        const total = await courseMaterialModel.countDocuments(query);

        const materials = await courseMaterialModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('user_id', 'name')
            .populate('course_id', 'title');

        return send(res, RESPONSE.SUCCESS, {
            materials,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Download route for file type materials
router.get("/download/:id", authenticate, async (req, res) => {
    try {
        const material = await courseMaterialModel.findOne({
            _id: req.params.id,
            type: "file",
            isactive: STATE.ACTIVE
        });

        if (!material) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "material"));
        }

        const filePath = path.join(process.cwd(), material.content);
        res.download(filePath);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;
