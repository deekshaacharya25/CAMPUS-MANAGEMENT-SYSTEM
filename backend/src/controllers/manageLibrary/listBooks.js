import express from "express";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { RESPONSE } from "../../config/global.js";
import libraryModel from "../../models/libraryModel.js";
import { STATE } from "../../config/constants.js";

const router = express.Router();

// Get all books with filters and pagination
router.get("/", async (req, res) => {
    try {
        const { search, category, page = 1, limit = 10, id } = req.query;

        // If ID is provided, return specific book
        if (id) {
            const book = await libraryModel
                .findOne({
                    _id: id,
                    isactive: STATE.ACTIVE
                })
                .populate('added_by', 'name');

            if (!book) {
                return send(res, setErrorRes(RESPONSE.NOT_FOUND, "book"));
            }

            return send(res, RESPONSE.SUCCESS, book);
        }

        // Otherwise, proceed with list query
        let query = { isactive: STATE.ACTIVE };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const total = await libraryModel.countDocuments(query);

        const books = await libraryModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('added_by', 'name');

        return send(res, RESPONSE.SUCCESS, {
            books,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;