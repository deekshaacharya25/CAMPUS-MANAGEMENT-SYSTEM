import {Router} from "express";
const router = Router();

import addBooks from "./addBooks.js"
import listBooks from "./listBooks.js"
import deleteBooks from "./deleteBooks.js"
import editBooks from "./editBooks.js"
import borrowBooks from "./borrowBooks.js"
import returnBooks from "./returnBooks.js"


router.use('/add',addBooks);
router.use('/list',listBooks);
router.use('/delete',deleteBooks);
router.use('/edit',editBooks);

// Book borrowing routes
router.use('/borrow',borrowBooks);
router.use('/return',returnBooks);

export default router;