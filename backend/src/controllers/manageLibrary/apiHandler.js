import {Router} from "express";
const router = Router();

import addBooks from "./addBooks.js"
import listBooks from "./listBooks.js"


router.use('/add',addBooks);
router.use('/list',listBooks);

export default router;