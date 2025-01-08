import {Router} from "express";
const router = Router();

import addUser from "./addUser.js"
import listUser from "./listUser.js"
import deleteUser from "./deleteUser.js"
import editUser from "./editUser.js"

router.use('/add',addUser);
router.use('/list',listUser);
router.use('/delete',deleteUser);
router.use('/edit',editUser);

export default router;