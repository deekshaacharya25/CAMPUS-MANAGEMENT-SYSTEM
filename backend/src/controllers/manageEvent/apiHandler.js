import {Router} from "express";
const router = Router();

import addEvent from "./addEvent.js"
import listEvent from "./listEvent.js"
import deleteEvent from "./deleteEvent.js"
import editEvent from "./editEvent.js"

router.use('/add',addEvent);
router.use('/list',listEvent);
router.use('/delete',deleteEvent);
router.use('/edit',editEvent);

export default router;