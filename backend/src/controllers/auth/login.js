
import { response, Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

router.post("/", async (req, res) => {
    try {

        const { username, password} = req.body;
     

        if (!username || username == undefined) {
  
            return send(res, setErrorRes(RESPONSE.REQUIRED,"username"));
        }

        if (!password || password == undefined) {
          
            return send(res, setErrorRes(RESPONSE.REQUIRED,"password"));
         
        }

        
        const normalizedUsername = username.trim().toLowerCase();

        
        let isEmail = validator.isEmail(normalizedUsername);


        let userData = await userModel.findOne({
            // email: normalizedUsername
            isactive: STATE.ACTIVE,
            $or:[{ phone: normalizedUsername},{email:normalizedUsername}],
        });

        console.log("Query:", {
            email: normalizedUsername
        });

        console.log("Username:", username);
        console.log("User Data:", userData);

        if(userData && (await bcrypt.compare(password, userData.password))){
            let token = jwt.sign({ 
                id: userData._id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
            },process.env.SECRETKEY
            );
            return send(res,RESPONSE.SUCCESS,token);
        }else{
            return send(res, setErrorRes(RESPONSE.INVALID, "Login Credential"));
        }

    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;
// router.post("/", async (req, res) => {
//     try {

//         const { username, password} = req.body;
     

//         if (!username || username == undefined) {
  
//             return send(res, setErrorRes(RESPONSE.REQUIRED,"username"));
//         }

//         if (!password || password == undefined) {
          
//             return send(res, setErrorRes(RESPONSE.REQUIRED,"password"));
         
//         }


// let userData = await userModel.findOne({
//     isactive: STATE.ACTIVE,
//     $or:[{ phone: username},{email:username}],
//    });

//    console.log("Username:", username);
// console.log("User  Data:", userData);

   
// if(userData && (await bcrypt.compare(password, userData.password))){
//     let token = jwt.sign({ 
//     id: userData._id,
//     name: userData.name,
//     email: userData.email,
//     phone: userData.phone,
//     role: userData.role,
//     },process.env.SECRETKEY
// );
//     return send(res,RESPONSE.SUCCESS,token);
// }else{
//      return send(res, setErrorRes(RESPONSE.INVALID, "Login Credential"));
// }

//     } catch (error) {
//         console.log(error);
//         return send(res, RESPONSE.UNKNOWN_ERR);
//     }
// });
// export default router;



