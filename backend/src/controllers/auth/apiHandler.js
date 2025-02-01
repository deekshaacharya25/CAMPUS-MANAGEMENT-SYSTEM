import {Router} from "express";
const router = Router();

import register from "./register.js"
import login from "./login.js"
import resetPassword from "./resetPassword.js"

router.use('/register',register);
router.use('/login',login);
router.use('/reset-password',resetPassword)
export default router;