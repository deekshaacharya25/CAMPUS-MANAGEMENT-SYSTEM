import {Router} from "express";
const router = Router();

import addBooks from "./addBooks.js"
import listBooks from "./listBooks.js"
// import deleteBooks from "./deleteBooks.js"
// import editBooks from "./editBooks.js"



router.use('/add',addBooks);
router.use('/list',listBooks);
// router.use('/delete',deleteBooks);
// router.use('/edit',editBooks);

export default router;