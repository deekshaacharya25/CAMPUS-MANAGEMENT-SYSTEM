import { response, Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import validator from "validator";
import bcrypt from "bcrypt"
router.post("/", async (req, res) => {
    try {

        const {name,  email, phone, password, role} = req.body;
     
        const user = userModel();
    
        if (!name || name == undefined) {
  
            return send(res, setErrorRes(RESPONSE.REQUIRED,"name"));
        }
        if (!phone || phone == undefined) {
      
            return send(res, setErrorRes(RESPONSE.REQUIRED,"phone"));
        }
        if (!email || email == undefined) {
           
            return send(res, setErrorRes(RESPONSE.REQUIRED,"email"));  
        }
        if (!password || password == undefined) {
          
            return send(res, setErrorRes(RESPONSE.REQUIRED,"password"));
         
        }
        if (!role || role == undefined) {
      
            return send(res, setErrorRes(RESPONSE.REQUIRED,"phone"));
        }
        let isEmail = validator.isEmail(email);
        if (!isEmail){
            return send(res, setErrorRes(RESPONSE.INVALID,"email"));
        }

let isExist = await userModel.aggregate([
    {
    $match: {
        phone:phone,
        isactive:STATE.ACTIVE,
    }
},
]);
   
if (isExist.length > 0){
    return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS,"phone"));
}
let isValidPhone = phone.toString().match(/^\+91\d{10}$/);

if (!isValidPhone) {
    return send(res, setErrorRes(RESPONSE.INVALID,"phone"));
}

let isValidPassword = password.toString().match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/);


if (!isValidPassword) {
    return send(res, setErrorRes(RESPONSE.INVALID,"Password Pattern"));
 
}
let encryptedPass = await bcrypt.hash(password, Number(process.env.SALTROUND));
console.log("encryptedPass",encryptedPass);

        userModel.create(
            {
            name,
            email: email,
            phone: phone,
            password:encryptedPass,
            role: role,
            isactive: STATE.ACTIVE,
        });
        return send(res,RESPONSE.SUCCESS);


    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;



