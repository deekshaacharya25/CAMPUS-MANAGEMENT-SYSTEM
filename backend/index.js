import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/helper/dbConnection.js";
import './src/controllers/manageEvent/notificationCron.js';
import routes from "./router.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from "cors";

dotenv.config();

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Static files directory:", path.join(__dirname, "public"));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, "public/uploads")));

// Add this line to handle CORS specifically for the uploads
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Connect to the database
connectDB();

// Set up routes
routes(app);

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
