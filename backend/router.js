import {Router} from "express";
const router = Router();

import userApiHandler from './src/controllers/auth/apiHandler.js';
const routes= (app) => {


    app.use("/api/auth",userApiHandler);
    
};
export default routes;