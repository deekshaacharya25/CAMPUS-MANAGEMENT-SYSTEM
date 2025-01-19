import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import directMessages from "./directMessages.js";
import announcements from "./announcement.js";
import forumPosts from "./forumPosts.js";

const router = Router();

router.use('/direct', directMessages);
router.use('/announcement', announcements);
router.use('/forum',forumPosts);

export default router;