import {Router} from "express";
const router = Router();

import apiHandler from './src/controllers/auth/apiHandler.js';
import userApiHandler from './src/controllers/manageUser/apiHandler.js';
import studentApiHandler from './src/controllers/manageUser/apiHandler.js';
import courseApiHandler from './src/controllers/manageCourse/apiHandler.js';
const routes= (app) => {


    app.use("/api/auth",apiHandler);
    app.use("/api/user", userApiHandler);
    app.use("/api/user/by-faculty-id", studentApiHandler);
    app.use("/api/course", courseApiHandler);
    
};
export default routes;