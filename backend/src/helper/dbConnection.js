import mongoose from 'mongoose';
export const connectDB = () => {
    try{
        
        mongoose.connect(process.env.DB_URL, { dbName: process.env.DB_NAME});
        console.log("Database connected successfully");
    } catch(error){
        console.log("Unable to connect to DB")
    }
};