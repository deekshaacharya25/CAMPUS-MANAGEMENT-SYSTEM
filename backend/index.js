import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/helper/dbConnection.js";
import './src/controllers/manageEvent/notificationCron.js';
import routes from "./router.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";
import fs from 'fs';

dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

console.log("Uploads directory:", uploadsDir);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, "public/uploads"),{
  setHeaders: (res, path) => {
    // Set proper content type for PDF files
    if (path.endsWith('.pdf')) {
        res.set('Content-Type', 'application/pdf');
    }
    // Add cache control headers
    res.set('Cache-Control', 'public, max-age=3600');
}
}));

// Add this line to handle CORS specifically for the uploads
// app.use('/uploads', (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to the database
connectDB();

// Set up routes
routes(app);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
  console.log(`Uploads directory is configured at: ${uploadsDir}`)
});
