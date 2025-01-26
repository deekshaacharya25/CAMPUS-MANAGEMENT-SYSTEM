import { Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import mongoose from "mongoose";
import { authenticate } from "../../middlewares/authenticate.js";

router.put("/", authenticate, async (req, res) => {
  try {
    const u_id = req.query.u_id;

    if (!u_id) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "u_id"));
    }

    const { name, email, phone, role, password, image } = req.body;
    const updates = {};

    const userData = await userModel.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", new mongoose.Types.ObjectId(u_id)] },
          isactive: STATE.ACTIVE,
        },
      },
    ]);

    if (userData.length === 0) {
      return send(res, setErrorRes(RESPONSE.NOT_FOUND, "User data not found"));
    }

    
    if (name && name.trim() !== "") {
      const isExist = await userModel.aggregate([
        {
          $match: {
            name: name,
            isactive: STATE.ACTIVE,
          },
        },
      ]);
      updates.name = name;
    }

    
    if (email) {
      const isEmail = validator.isEmail(email);
      if (!isEmail) {
        return send(res, setErrorRes(RESPONSE.INVALID, "Invalid email"));
      }
      updates.email = email;
    }

    if (phone) {
      const isValidPhone = phone.toString().match(/^\+91\d{10}$/);
      if (!isValidPhone) {
        return send(res, setErrorRes(RESPONSE.INVALID, "Invalid phone number"));
      }
      updates.phone = phone;
    }

    if (!role || role !== undefined ) {
      updates.role = role;
    }


    if (!password || password !== undefined) {
      updates.password = password;
    }

    if (req.files && req.files.length > 0) {
      const filenames = req.files.map((file) => file.filename);
      updates.image = filenames;
    }


    console.log("Updates Object Before Saving:", updates);


    await userModel.updateMany(
      { _id: new mongoose.Types.ObjectId(u_id) },
      { $set: updates }
    );

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.error("Error updating user:", error);
    return send(res, setErrorRes(RESPONSE.UNKNOWN_ERR, error.message));
  }
});

export default router;
