import { Router } from "express";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import { authenticate } from "../../middlewares/authenticate.js";
import courseModel from "../../models/courseModel.js";
import facultyModel from "../../models/facultyModel.js";
import mongoose from "mongoose";

const router = Router();

// Route to assign a course to a faculty
router.post("/assign", authenticate, async (req, res) => {
  try {
    // Check user role (if required)
    if (req.user.role !== ROLE.ADMIN) {
      return send(res, RESPONSE.UNAUTHORIZED);
    }

    // Extract fields from the request body
    const { courseId, facultyId } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!courseId || courseId === undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "courseId"));
    }

    if (!facultyId || facultyId === undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
    }

    // Check if the course exists
    const course = await courseModel.findById(courseId);
    if (!course || course.isactive === STATE.INACTIVE) {
      return send(res, setErrorRes(RESPONSE.NOT_FOUND, "course"));
    }

    // Check if the faculty exists
    const faculty = await facultyModel.findById(facultyId);
    if (!faculty || faculty.isactive === STATE.INACTIVE) {
      return send(res, setErrorRes(RESPONSE.NOT_FOUND, "faculty"));
    }

    // Assign course to faculty
    course.facultyId = new mongoose.Types.ObjectId(facultyId);
    await course.save();

    // Optionally, you could track the user making the change
    // Example: record the action in a separate log or audit collection

    return send(res, RESPONSE.SUCCESS, { course });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return send(res, RESPONSE.UNKNOWN_ERR);
    }
  }
});

// Route to fetch all courses assigned to a faculty
router.get("/faculty/:facultyId", authenticate, async (req, res) => {
  try {
    const { facultyId } = req.params;

    // Validate facultyId
    if (!facultyId || facultyId === undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
    }

    // Fetch courses assigned to the faculty
    const courses = await courseModel.find({ facultyId: facultyId, isactive: STATE.ACTIVE });

    if (!courses || courses.length === 0) {
      return send(res, RESPONSE.NOT_FOUND);
    }

    return send(res, RESPONSE.SUCCESS, { courses });
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return send(res, RESPONSE.UNKNOWN_ERR);
    }
  }
});

export default router;
