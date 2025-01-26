import { response, Router } from "express"
const router = Router();
import courseModel from "../../models/courseModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.put("/", async (req, res) => {
    try {
       let course_id = req.query.course_id;

       let {title, description, faculty_id} =req.body;
       let updates= {};
       

       if (!course_id || course_id == undefined) {
                   return send(res, setErrorRes(RESPONSE.REQUIRED,"course_id"));
               }
         let courseData = await courseModel.aggregate([
                   {
                $match :{ $expr : { $eq : ["$_id", {$toObjectId: course_id}] }, 
                isactive: STATE.ACTIVE,
            },
            },
         ]);

         if(courseData.length === 0){
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "course data"));
         }

        console.log(courseData);

        if( title && title != undefined){
            let isExist = await courseModel.aggregate([
                {
                $match: {
                    title:title,
                    isactive:STATE.ACTIVE,
                }
            },
            ]);
            updates.title = title;
        }
        if( description && description != undefined){
            updates.description = description;
        }
        
        if( faculty_id && faculty_id != undefined){
            updates.faculty_id = faculty_id;
        }
    await courseModel.updateMany(
        { _id: course_id,

         }, { 
            $set: updates,
         }
    );

    
    console.log(updates);


    return send(res,RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;