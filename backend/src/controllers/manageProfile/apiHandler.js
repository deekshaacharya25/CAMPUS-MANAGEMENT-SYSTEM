// apiHandler.js
import { Router } from "express";
const router = Router();

import studentProfile from "./studentProfile.js";
import facultyProfile from "./facultyProfile.js";
import updateProfile from "./updateProfileUtils.js";

router.use('/student', studentProfile);
router.use('/faculty', facultyProfile);
router.use('/update', updateProfile);

export default router;