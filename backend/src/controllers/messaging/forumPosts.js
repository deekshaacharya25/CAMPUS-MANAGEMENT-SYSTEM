import { Router } from "express";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import forumPostModel from "../../models/forumPostModel.js";
import { STATE } from "../../config/constants.js";
import { authenticate } from "../../middlewares/authenticate.js";
import multer from "multer";
import path from "path";
import mongoose from "mongoose";

const router = Router();

// Configure multer for forum uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "forum-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed"));
    }
};

const upload = multer({ storage, fileFilter });

// Create a forum post with images
router.post("/create", authenticate, upload.array("images", 5), async (req, res) => {
    try {
        const { title, caption, category } = req.body;
        const author_id = req.user.id;

        if (!title || !caption || !category) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "title, caption and category"));
        }

        const images = req.files ? req.files.map(file => file.filename) : [];

        const newPost = await forumPostModel.create({
            author_id,
            title,
            caption,
            category,
            images
        });

        return send(res, RESPONSE.SUCCESS, newPost);
    } catch (error) {
        console.error(error);
        if (error instanceof multer.MulterError) {
            return send(res, setErrorRes(RESPONSE.INVALID, "File upload error"));
        }
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get all forum posts
router.get("/posts", async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        const query = { isactive: STATE.ACTIVE };
        
        if (category) {
            query.category = category;
        }

        const posts = await forumPostModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('author_id', '_id name email')
            .populate('comments.user_id', 'name email');

        return send(res, RESPONSE.SUCCESS, posts);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Add comment with image to a post
router.post("/comment", authenticate, upload.single("image"), async (req, res) => {
    try {
        const { caption } = req.body;
        const { post_id } = req.query;

        if (!post_id || post_id == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "post_id"));
        }

        if (!mongoose.Types.ObjectId.isValid(post_id)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "post_id"));
        }

        const comment = {
            user_id: req.user.id,
            caption: caption || "", // Allow empty caption
            image: req.file ? req.file.filename : undefined
        };

        console.log('Adding comment to post:', post_id, comment);

        const updatedPost = await forumPostModel.findOneAndUpdate(
            {
                _id: post_id,
                isactive: STATE.ACTIVE
            },
            {
                $push: {
                    comments: comment
                }
            },
            {
                new: true
            }
        ).populate('comments.user_id', 'name email');

        if (!updatedPost) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "post"));
        }

        return send(res, RESPONSE.SUCCESS, updatedPost.comments);

    } catch (error) {
        console.error('Error submitting comment:', error);
        if (error instanceof multer.MulterError) {
            return send(res, setErrorRes(RESPONSE.INVALID, "File upload error"));
        }
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Delete a forum post
router.delete("/delete/:postId", authenticate, async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "post_id"));
        }

        const post = await forumPostModel.findById(postId);

        if (!post) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "post"));
        }

        if (post.author_id.toString() !== userId) {
            return send(res, setErrorRes(RESPONSE.UNAUTHORIZED, "You are not authorized to delete this post"));
        }

        await forumPostModel.findByIdAndDelete(postId);

        return send(res, RESPONSE.SUCCESS, "Post deleted successfully");
    } catch (error) {
        console.error('Error deleting post:', error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;