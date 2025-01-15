import { Router } from "express";
import directMessages from "./directMessages.js";
import forumPosts from "./forumPosts.js";
import { authenticate } from "../../middleware/auth.js";

const router = Router();

router.use('/direct', authenticate, directMessages);
router.use('/forum', authenticate, forumPosts);

export default router;