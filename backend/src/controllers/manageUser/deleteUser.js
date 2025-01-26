import { response, Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE,ROLE } from "../../config/constants.js";
import validator from "validator";
import mongoose from "mongoose";
import { authenticate } from "../../middlewares/authenticate.js";


router.delete("/", authenticate ,async (req, res) => {
    try {
            if (req.user.role !== ROLE.ADMIN) {
              return send(res, RESPONSE.UNAUTHORIZED);
            }
       let u_id = req.query.u_id;

       if (!u_id || u_id == undefined) {
                   return send(res, setErrorRes(RESPONSE.REQUIRED,"u_id"));
               }

               if (!mongoose.Types.ObjectId.isValid(u_id)) {
                return send(res, setErrorRes(RESPONSE.INVALID, "u_id"));
            }
            const objectId = new mongoose.Types.ObjectId(u_id);
         let userData = await userModel.aggregate([
                   {
                $match :{ $expr : { $eq : ["$_id", objectId] }, 
                isactive: STATE.ACTIVE,
            },
            },
         ]);

         if(userData.length === 0){
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "user data"));
         }

        console.log(userData);



    await userModel.deleteOne({
        _id: u_id,
 
});


        return send(res,RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;