// import {Router} from "express";
import express from "express";
const app=express();
// const router = Router();

import dotenv from "dotenv";
import {connectDB} from "./src/helper/dbConnection.js";
import routes from "./router.js";
import path from "path";
dotenv.config();
const __dirname =  path.resolve();
console.log(__dirname);


import cors from "cors";

app.use(cors()); 

const PORT=process.env.PORT;

// router.get("/",(req,res) =>{
//  return  res.json({responseMessage: "All good"});
// });

app.use(express.json());
app.use(express.urlencoded({ extended : true}));
app.use(express.static(path.join(__dirname, "public/uploads")));
connectDB();


routes(app);

app.listen(PORT,() => {
    console.log("Server is listening on PORT",PORT);
});

