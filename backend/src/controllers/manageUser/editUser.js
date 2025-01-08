import { response, Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
    try {
       let user_id = req.query.user_id;

       let {name, email, phone, password} =req.body;
       let updates= {};
       

       if (!user_id || user_id == undefined) {
                   return send(res, setErrorRes(RESPONSE.REQUIRED,"user_id"));
               }
         let userData = await userModel.aggregate([
                   {
                $match :{ $expr : { $eq : ["$_id", {$toObjectId: user_id}] }, 
                isactive: STATE.ACTIVE,
            },
            },
         ]);

         if(userData.length === 0){
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "user data"));
         }

        console.log(userData);

        if( name && name != undefined){
            updates.name = name;
        }
        if( phone && phone != undefined){
            let isExist = await userModel.aggregate([
                {
                $match: {
                    phone:phone,
                    isactive:STATE.ACTIVE,
                }
            },
            ]);
            updates.phone = phone;
        }
        if( email && email != undefined){
               let isEmail = validator.isEmail(email);
                    if (!isEmail){
                        return send(res, setErrorRes(RESPONSE.INVALID,"email"));
                    }
            updates.email = email;
        }
        if( password && password != undefined){
            updates.password = password;
        }
    await userModel.updateMany(
        { _id: user_id,

         }, { 
            $set: updates,
         }
    );
    //     await userModel.findByIdAndUpdate({
    //         _id: user_id,
    //         isactive: STATE.ACTIVE,
    //     },
    // {
    //     isactive: STATE.INACTIVE,
    // });
    
    console.log(updates);


    return send(res,RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;