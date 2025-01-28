import { Router } from "express";
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE, ROLE } from "../../config/constants.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { authenticate } from "../../middlewares/authenticate.js";
import { image } from "../../middlewares/uploads.js";

router.post("/", authenticate, image, async (req, res) => {
  console.log("Incoming Request Body:", req.body); // Log the request body
  console.log("User Role:", req.user.role); // Log the user role

  // Check if user is admin
  if (req.user.role !== ROLE.ADMIN) {
    console.log("Access Denied: User is not an admin."); // Log access denial
    return send(res, RESPONSE.UNAUTHORIZED);
  }

  const { name, email, phone, password, role ,departmentId} = req.body;

  // Validate required fields
  if (!name || name == undefined) {
    return send(res, setErrorRes(RESPONSE.REQUIRED, "name"));
  }

  if (!email || email == undefined) {
    return send(res, setErrorRes(RESPONSE.REQUIRED, "email"));
  }

  if (!phone || phone == undefined) {
    return send(res, setErrorRes(RESPONSE.REQUIRED, "phone"));
  }

  if (!password || password == undefined) {
    return send(res, setErrorRes(RESPONSE.REQUIRED, "password"));
  }

  if (!validator.isEmail(email)) {
    return send(res, setErrorRes(RESPONSE.INVALID, "email"));
  }

  let isValidPhone = phone.toString().match(/^\+91\d{10}$/);
  if (!isValidPhone) {
    return send(res, setErrorRes(RESPONSE.INVALID, "phone"));
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

  // Add password hashing before creating user
  let encryptedPass = await bcrypt.hash(password, Number(process.env.SALTROUND));

  // Get image filenames
  const images = req.files ? req.files.map(file => file.filename) : [];

  // Create user with images
  await userModel.create({
    name,
    email,
    phone,
    password: encryptedPass,
    role: Number(role),
    image: images,
    departmentId,
    isactive: STATE.ACTIVE
  });

  return send(res, RESPONSE.SUCCESS);
});

export default router;
