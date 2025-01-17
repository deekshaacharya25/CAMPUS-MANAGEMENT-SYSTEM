import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import directMessages from "./directMessages.js";
import announcements from "./announcement.js";
import forumPosts from "./forumPosts.js";

const router = Router();

router.use('/direct', authenticate, directMessages);
router.use('/announcements', authenticate, announcements);
router.use('/forum', authenticate, forumPosts);

export default router;