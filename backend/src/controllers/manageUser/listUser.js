import { response, Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import mongoose from "mongoose";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import express from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { ROLE } from "../../config/constants.js";

router.get("/", authenticate, async (req, res) => {
    try {
       
        // let user_id =req.params.id;
        // console.log(user_id);
        let phone =req.query.phone;
        let query={};
        let u_id=req.query.id;

        //..
        // let teacher_id = req.user.id;
        // query.teacher_id =teacher_id; //req.user.id;
        // query.$expr = { $eq : ["$teacher_id", {$toObjectId: teacher_id}]}
        // query.isactive= STATE.ACTIVE;
        //..

        phone != undefined ? (query.phone = phone) : "";
        


        if (u_id != undefined) {
            query._id = new mongoose.Types.ObjectId(u_id);
        }

        console.log(query);
        let userData = await userModel.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    isactive: 0,
                    __v: 0,
                },
            },
        ]);

        if(userData.length==0){
            return setErrorRes(res, setErrorRes(RESPONSE.NOT_FOUND, "user Data"));
        }
        userData = (userData || []).map((itm) => ({
            ...itm,
            image: (itm.image || []).map((img) => "/" + img),
          }));
    
    

        return send(res,RESPONSE.SUCCESS,userData);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

// Endpoint to list students by facultyId
router.get("/by-faculty-id", authenticate, async (req, res) => {
    try {
        // Extract facultyId from query parameters
        const { facultyId } = req.query;

        // Validate facultyId
        if (!facultyId || facultyId === undefined) {
            return send(res, setErrorRes(RESPONSE.REQUIRED, "facultyId"));
        }

        // Validate facultyId format
        if (!mongoose.Types.ObjectId.isValid(facultyId)) {
            return send(res, setErrorRes(RESPONSE.INVALID, "Invalid facultyId format"));
        }

        // Convert facultyId to ObjectId
        const objectId =new mongoose.Types.ObjectId(facultyId);

        // Build the query
        const query = {
            facultyId: objectId,
            role: 3, 
            isactive: STATE.ACTIVE,
        };

        // Fetch students based on facultyId
        let studentData = await userModel.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    isactive: 0,
                    __v: 0,
                },
            },
        ]);

        // Check if students exist
        if (studentData.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "students for the given facultyId"));
        }

        // Map image paths if needed
        studentData = (studentData || []).map((itm) => ({
            ...itm,
            image: (itm.image || []).map((img) => "/" + img),
        }));

        // Return success response with student data
        return send(res, RESPONSE.SUCCESS, studentData);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

router.get("/faculties", authenticate, async (req, res) => {
    try {
        // Build the query
        const query = {
            role: 2, // Assuming role 2 corresponds to faculty
            isactive: STATE.ACTIVE, 
        };

        // Fetch all students based on the query
        let faculties = await userModel.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    isactive: 0, // Exclude sensitive fields if needed
                    __v: 0,
                },
            },
        ]);

        // Check if students exist
        if (faculties.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "No faculties found"));
        }

        // Return success response with faculty data
        return send(res, RESPONSE.SUCCESS, faculties);
    } catch (error) {
        console.error("Error fetching faculties:", error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});

router.get("/students", authenticate, async (req, res) => {
    try {
        // Build the query for role 3
        const query = {
            role: 3, 
            isactive: STATE.ACTIVE, 
        };

        // Fetch all students based on the query
        let students = await userModel.aggregate([
            {
                $match: query,
            },
            {
                $project: {
                    isactive: 0, // Exclude sensitive fields if needed
                    __v: 0,
                },
            },
        ]);

        // Check if students exist
        if (students.length === 0) {
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "No students found"));
        }

        // Return success response with student data
        return send(res, RESPONSE.SUCCESS, students);
    } catch (error) {
        console.error("Error fetching students:", error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;