import { Router } from "express";
import addEvent from "./addEvent.js";
import deleteEvent from "./deleteEvent.js";
import editEvent from "./editEvent.js";
import listEvent from "./listEvent.js";
import campusEvents from "./campusEventController.js";
import academicCalendar from "./academicCalendarController.js";

const router = Router();

router.use('/add', addEvent);
router.use('/delete', deleteEvent);
router.use('/edit', editEvent);
router.use('/list', listEvent);
router.use('/campus', campusEvents);
router.use('/academic', academicCalendar);

export default router;