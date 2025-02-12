import {Router} from "express";
const router = Router();

import apiHandler from './src/controllers/auth/apiHandler.js';
import userApiHandler from './src/controllers/manageUser/apiHandler.js';
import studentApiHandler from './src/controllers/manageUser/apiHandler.js';
import courseApiHandler from './src/controllers/manageCourse/apiHandler.js';
import departmentApiHandler from './src/controllers/manageDepartment/apiHandler.js';
import eventApiHandler from './src/controllers/manageEvent/apiHandler.js';
import profileApiHandler from './src/controllers/manageProfile/apiHandler.js';
import libraryApiHandler from './src/controllers/manageLibrary/apiHandler.js';
import messageApiHandler from './src/controllers/messaging/apiHandler.js';
import facultyApiHandler from './src/controllers/manageUser/apiHandler.js'
import allStudentsApiHandler from './src/controllers/manageUser/apiHandler.js'
import facultyCourseApiHandler from './src/controllers/manageCourse/apiHandler.js';
const routes= (app) => {
    app.use("/api/auth",apiHandler);
    app.use("/api/user", userApiHandler);
    app.use("/api/user/by-faculty-id", studentApiHandler);
    app.use("/api/user/faculties", facultyApiHandler);
    app.use("/api/user/students", allStudentsApiHandler);
    app.use("/api/course", courseApiHandler);
    app.use("/api/course/by-faculty", facultyCourseApiHandler);
    app.use("/api/department", departmentApiHandler);
    app.use("/api/event", eventApiHandler);
    app.use("/api/profile", profileApiHandler);
    app.use("/api/library", libraryApiHandler);
    app.use("/api/message", messageApiHandler);
};
export default routes;