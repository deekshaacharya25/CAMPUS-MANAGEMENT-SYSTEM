import { RESPONSE } from '../config/global.js';
import {send, setErrorRes } from "../helper/responseHelper.js";
import jwt from "jsonwebtoken";
export const authenticate = (req,res,next) => {
    let token = req.headers["access_token"]

    if(!token){
        return send(res,RESPONSE.ACCESS_DENIED);
    }
    try{
    let decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user= decoded;
    } catch(error){
        return send(res, setErrorRes(RESPONSE.INVALID,"Token"));
    }
    return next();
};