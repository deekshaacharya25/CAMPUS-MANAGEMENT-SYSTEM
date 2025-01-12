import { response, Router } from "express"
const router = Router();
import courseModel from "../../models/courseModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import { authenticate } from "../../middlewares/authenticate.js";
router.get("/", authenticate, async (req, res) => {
    try {
       
        // let course_id =req.params.id;
        // console.log(course_id);
        let title =req.query.title;
        let query={};
        let course_id=req.query.id;

        //..
        // let teacher_id = req.course.id;
        // query.teacher_id =teacher_id; //req.course.id;
        // query.$expr = { $eq : ["$teacher_id", {$toObjectId: teacher_id}]}
        // query.isactive= STATE.ACTIVE;
        //..

        title != undefined ? (query.title = title) : "";
        
        course_id != undefined
        ? (query.$expr = { $eq : ["$_id", {$toObjectId: course_id}]})
        : "";

        console.log(query);
        let courseData = await courseModel.aggregate([
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

        if(courseData.length==0){
            return setErrorRes(res, setErrorRes(RESPONSE.NOT_FOUND, "course Data"));
        }
        courseData = (courseData || []).map((itm) => ({
            ...itm,
            image: (itm.image || []).map((img) => "/" + img),
          }));
          

        return send(res,RESPONSE.SUCCESS,courseData);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;