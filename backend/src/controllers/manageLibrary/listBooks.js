import express from "express";
import { authenticate } from "../../middleware/auth.js";
import { RESPONSE, send, setErrorRes } from "../../config/response.js";
import libraryModel from "../../models/libraryModel.js";
import { STATE } from "../../config/constants.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
    try {
        // Get query parameters for filtering and pagination
        const { search, category, page = 1, limit = 10 } = req.query;
        
        // Build query object
        let query = { isactive: STATE.ACTIVE };
        
        // Add search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { isbn: { $regex: search, $options: 'i' } }
            ];
        }

        // Add category filter
        if (category) {
            query.category = category;
        }

        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Get total count for pagination
        const totalBooks = await libraryModel.countDocuments(query);

        // Fetch books with pagination
        const books = await libraryModel
            .find(query)
            .select('-borrowers') // Exclude borrowers array for security
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); // Sort by newest first

        // If no books found
        if (!books || books.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "books"));
        }

        // Return success with pagination info
        return send(res, RESPONSE.SUCCESS, {
            books,
            pagination: {
                total: totalBooks,
                page: parseInt(page),
                pages: Math.ceil(totalBooks / parseInt(limit)),
                limit: parseInt(limit)
            }
        });

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Get book details by ID
router.get("/:id", authenticate, async (req, res) => {
    try {
        const bookId = req.params.id;
        
        const book = await libraryModel
            .findOne({ 
                _id: bookId, 
                isactive: STATE.ACTIVE 
            })
            .populate('added_by', 'name email') // Populate admin details
            .populate('borrowers.user_id', 'name email'); // Populate borrower details

        if (!book) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "book"));
        }

        return send(res, RESPONSE.SUCCESS, book);

    } catch (error) {
        console.error(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

export default router;