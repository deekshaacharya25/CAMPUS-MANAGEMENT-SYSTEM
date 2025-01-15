import { response, Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import validator from "validator";
import { authenticate } from "../../middlewares/authenticate.js";
import multer from "multer";
import image from "../../middlewares/uploads.js";

const upload = image.array("image");

router.post("/", authenticate, async (req, res) => {
  try {
    // Check user role (if required)
    if (req.user.role !== ROLE.ADMIN) {
      return send(res, RESPONSE.UNAUTHORIZED);
    }

    // Use the Multer upload middleware
    upload(req, res, async (err) => {
     
        // Handle Multer-specific errors
        if (err instanceof multer.MulterError) {
          return send(res, RESPONSE.MULTER_ERR);
        }else if (err) {
        return send(res, RESPONSE.UNKNOWN_ERR);
        }


        let filename = [];
        if (req.files != null) {
          req.files.forEach((ele) =>{
            filename.push(ele.filename);
          });
        }
        console.log(filename);
      // Ensure at least one file is uploaded
      if (!req.files || req.files.length < 1) {
        return send(res, setErrorRes(RESPONSE.REQUIRED, "image"));
      }

      console.log(req.files);

      // Extract fields from the request body
      const { name, email ,phone, role, password, facultyId } = req.body;
      const user_id = req.user.id;

      // Validate required fields
      if (!name || name == undefined) {

        return send(res, setErrorRes(RESPONSE.REQUIRED,"name"));
    }
    
    if (!email || email == undefined) {
      
        return send(res, setErrorRes(RESPONSE.REQUIRED,"email"));
     
    }
    if (!phone || phone == undefined) {
      
        return send(res, setErrorRes(RESPONSE.REQUIRED,"phone"));
     
    }
    if (!password || password == undefined) {
      
        return send(res, setErrorRes(RESPONSE.REQUIRED,"password"));
    }

      if (!validator.isEmail(email)) {
        return send(res, setErrorRes(RESPONSE.INVALID, "email"));
      }
      let isValidPhone = phone.toString().match(/^\+91\d{10}$/);
      // console.log(isValidPhone);
      
      if (!isValidPhone) {
          return send(res, setErrorRes(RESPONSE.INVALID,"phone"));
      }      
   
      const isExist = await userModel.aggregate([
        {
          $match: {
            phone: phone,
            isactive: STATE.ACTIVE,
          },
        },
      ]);

      if (isExist.length > 0) {
        return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS, "phone"));
      }

      await userModel.create({
        name: name,
        email: email,
        phone: phone,
        password: password,
        role:role,
        image:filename,
        user_id: user_id,
        facultyId: facultyId,
      });

      return send(res, RESPONSE.SUCCESS);
    });
  } catch (error) {
    console.error(error);
   
    if (!res.headersSent) {
      return send(res, RESPONSE.UNKNOWN_ERR);
    }
  }
});

export default router;
