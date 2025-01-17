import express from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import libraryModel from "../../models/libraryModel.js";
import { STATE, ROLE } from "../../config/constants.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        
        if (req.user.role !== ROLE.ADMIN) {
            return send(res, RESPONSE.UNAUTHORIZED);
        }
        const { title, author, isbn, quantity, category, description } = req.body;


        if (!title || title == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "title"));
        }
        if (!author || author == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "author"));
        }
        if (!isbn || isbn == undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "ISBN"));
        }
        if (!quantity || quantity < 0) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "valid quantity"));
        }

        // Check if book already exists
        const existingBook = await libraryModel.findOne({
            isbn: isbn,
            isactive: STATE.ACTIVE
        });

        if (existingBook) {
            return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS, "book with this ISBN"));
        }

        // Create new book
        const newBook = await libraryModel.create({
            title,
            author,
            isbn,
            quantity,
            category,
            description,
            added_by: req.user.id
        });

        return send(res, RESPONSE.SUCCESS, newBook);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;

