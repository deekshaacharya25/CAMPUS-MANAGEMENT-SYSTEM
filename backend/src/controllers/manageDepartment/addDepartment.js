import { response, Router } from "express";
const router = Router();
import departmentModel from "../../models/departmentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import validator from "validator";
import { authenticate } from "../../middlewares/authenticate.js";
import mongoose from "mongoose";


router.post("/", authenticate, async (req, res) => {
  try {
    // Check user role (if required)
    if (req.user.role !== ROLE.ADMIN) {
      return send(res, RESPONSE.UNAUTHORIZED);
    }

      // Extract fields from the request body
      const { name, description, createdAt} = req.body;
      const user_id = req.user.id;

      // Validate required fields
      if (!name || name == undefined) {

        return send(res, setErrorRes(RESPONSE.REQUIRED,"name"));
    }
    
    if (!description || description == undefined) {
      
        return send(res, setErrorRes(RESPONSE.REQUIRED,"description"));
     
    }

      const isExist = await departmentModel.aggregate([
        {
          $match: {
            name: name,
            isactive: STATE.ACTIVE,
          },
        },
      ]);

      if (isExist.length > 0) {
        return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS, "name"));
      }

      await departmentModel.create({
        name: name,
        description: description,
        user_id: user_id,
        createdAt:createdAt,
      });

      return send(res, RESPONSE.SUCCESS);
    
  } catch (error) {
    console.error(error);
   
    if (!res.headersSent) {
      return send(res, RESPONSE.UNKNOWN_ERR);
    }
  }
});

export default router;

