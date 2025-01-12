import {Router} from "express";
const router = Router();

import addDepartment from "./addDepartment.js"
import listDepartment from "./listDepartment.js"
import deleteDepartment from "./deleteDepartment.js"
import editDepartment from "./editDepartment.js"

router.use('/add',addDepartment);
router.use('/list',listDepartment);
router.use('/delete',deleteDepartment);
router.use('/edit',editDepartment);

export default router;