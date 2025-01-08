import { response, Router } from "express"
const router = Router();
import userModel from "../../models/userModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";
import { authenticate } from "../../middlewares/authenticate.js";
router.get("/", authenticate, async (req, res) => {
    try {
       
        // let user_id =req.params.id;
        // console.log(user_id);
        let phone =req.query.phone;
        let query={};
        let user_id=req.query.id;

        //..
        // let teacher_id = req.user.id;
        // query.teacher_id =teacher_id; //req.user.id;
        // query.$expr = { $eq : ["$teacher_id", {$toObjectId: teacher_id}]}
        // query.isactive= STATE.ACTIVE;
        //..

        phone != undefined ? (query.phone = phone) : "";
        
        user_id != undefined
        ? (query.$expr = { $eq : ["$_id", {$toObjectId: user_id}]})
        : "";

        console.log(query);
        let userData = await userModel.aggregate([
            {
                // $match: {
                //     // _id: user_id,
                //     phone:phone,
                //     isactive: STATE.ACTIVE,
                // },

                $match: query,
            },
            // {
            //     $match :{ $expr : { $eq : ["$_id", {$toObjectId: user_id}] }},
            // },
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
export default router;