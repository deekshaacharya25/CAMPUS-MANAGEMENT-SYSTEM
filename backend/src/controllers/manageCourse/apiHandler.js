import {Router} from "express";
const router = Router();

import addCourse from "./addCourse.js"
import listCourse from "./listCourse.js"
import deleteCourse from "./deleteCourse.js"
import editCourse from "./editCourse.js"

router.use('/add',addCourse);
router.use('/list',listCourse);
router.use('/delete',deleteCourse);
router.use('/edit',editCourse);

export default router;