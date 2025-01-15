import { response, Router } from "express";
const router = Router();
import courseModel from "../../models/courseModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { ROLE, STATE } from "../../config/constants.js";
import validator from "validator";
import { authenticate } from "../../middlewares/authenticate.js";
import bookModel from "../../models/bookModel.js";



router.post("/", authenticate, async (req, res) => {
  try {
    // Check user role
    if (req.user.role !== ROLE.ADMIN) {
      return send(res, RESPONSE.UNAUTHORIZED);
    }

    // Extract fields from the request body
    const { title, author, isbn, quantity, category, description } = req.body;

    // Validate required fields
    if (!title) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "title"));
    }
    
    if (!author) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "author"));
    }

    if (!isbn) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "ISBN"));
    }

    if (!quantity || quantity < 0) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "valid quantity"));
    }

    // Check if book already exists with same ISBN
    const isExist = await bookModel.findOne({
      isbn: isbn,
      isactive: STATE.ACTIVE,
    });

    if (isExist) {
      return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS, "book with this ISBN"));
    }

    // Create new book
    await bookModel.create({
      title,
      author,
      isbn,
      quantity,
      category,
      description,
      available_quantity: quantity, // Track available copies
      createdAt: new Date(),
      isactive: STATE.ACTIVE,
      added_by: req.user.id
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

