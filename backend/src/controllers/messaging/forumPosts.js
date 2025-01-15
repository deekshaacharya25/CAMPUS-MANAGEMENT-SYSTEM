import { Router } from "express";
import { RESPONSE, send, setErrorRes } from "../../config/response.js";
import forumPostModel from "../../models/forumPostModel.js";
import { STATE } from "../../config/constants.js";

const router = Router();

// Create a forum post
router.post("/create", async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const author_id = req.user.id;

        if (!title || !content || !category) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "title, content and category"));
        }

        const newPost = await forumPostModel.create({
            author_id,
            title,
            content,
            category
        });

        return send(res, RESPONSE.SUCCESS, newPost);
    } catch (error) {
        console.error(error);
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
            .populate('author_id', 'name email')
            .populate('comments.user_id', 'name email');

        return send(res, RESPONSE.SUCCESS, posts);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Add comment to a post
router.post("/comment/:postId", async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;
        const user_id = req.user.id;

        if (!content) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "content"));
        }

        const updatedPost = await forumPostModel.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: { user_id, content }
                }
            },
            { new: true }
        ).populate('comments.user_id', 'name email');

        return send(res, RESPONSE.SUCCESS, updatedPost);
    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;