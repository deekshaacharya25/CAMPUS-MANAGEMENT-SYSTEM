import {Router} from "express";
const router = Router();

import addCourse from "./addCourse.js"
import listCourse from "./listCourse.js"
import deleteCourse from "./deleteCourse.js"
import editCourse from "./editCourse.js"
import uploadCourseMaterials from "./uploadCourseMaterials.js";

router.use('/add',addCourse);
router.use('/list',listCourse);
router.use('/delete',deleteCourse);
router.use('/edit',editCourse);
router.use('/materials', uploadCourseMaterials);

export default router;