import { Router } from "express";
import addEvent from "./addEvent.js";
import deleteEvent from "./deleteEvent.js";
import editEvent from "./editEvent.js";
import listEvent from "./listEvent.js";
import notificationCron from "./notificationCron.js";

const router = Router();

router.use('/add', addEvent);
router.use('/delete', deleteEvent);
router.use('/edit', editEvent);
router.use('/list', listEvent);
router.use('/notifications', notificationCron);

export default router;