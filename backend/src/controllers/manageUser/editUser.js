import { Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import mongoose from "mongoose";
import {image} from "../../middlewares/uploads.js";
import { authenticate } from "../../middlewares/authenticate.js";

router.put("/", async (req, res) => {
    try {
        let u_id = req.query.u_id;

        let {name, email, phone, password} =req.body;
        let updates= {};
        

        if (!u_id || u_id == undefined) {
                    return send(res, setErrorRes(RESPONSE.REQUIRED,"u_id"));
                }
          let userData = await userModel.aggregate([
                    {
                 $match :{ $expr : { $eq : ["$_id", new mongoose.Types.ObjectId(u_id)] }, 
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
             updates.phone = phone;
         }
         if( email && email != undefined){
                if (!validator.isEmail(email)){
                    return send(res, setErrorRes(RESPONSE.INVALID,"email"));
                }
             updates.email = email;
         }
         if( password && password != undefined){
             updates.password = password;
         }
         if( req.files && req.files.length > 0){
             let filename = [];
             req.files.forEach((ele) =>{
                 filename.push(ele.filename);
             });
             updates.image = filename;
         }
     await userModel.updateMany(
         { _id: u_id,

          }, { 
             $set: updates,
          }
     );
     //     await userModel.findByIdAndUpdate({
     //         _id: u_id,
     //         isactive: STATE.ACTIVE,
     //     },
     // {
     //     isactive: STATE.INACTIVE,
     // });
     
     console.log(updates);


     return send(res,RESPONSE.SUCCESS);
     } catch (error) {
         console.error(error);
         return send(res, RESPONSE.UNKNOWN_ERR);
     }
});
export default router;