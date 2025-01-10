import { response, Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.delete("/", async (req, res) => {
    try {
       let u_id = req.query.id;
       if (!u_id || u_id == undefined) {
                   return send(res, setErrorRes(RESPONSE.REQUIRED,"u_id"));
               }
         let userData = await userModel.aggregate([
                   {
                $match :{ $expr : { $eq : ["$_id", {$toObjectId: u_id}] }, 
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