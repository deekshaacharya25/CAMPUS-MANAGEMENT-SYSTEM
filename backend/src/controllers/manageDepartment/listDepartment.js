import { response, Router } from "express"
const router = Router();
import departmentModel from "../../models/departmentModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import validator from "validator";

router.get("/", async (req, res) => {
    try {
        let name =req.query.name;
        let query={};
        let department_id=req.query.department_id;

        name != undefined ? (query.name = name) : "";
        
        department_id != undefined
        ? (query.$expr = { $eq : ["$_id", {$toObjectId: department_id}]})
        : "";

        console.log(query);
        let departmentData = await departmentModel.aggregate([
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

        if(departmentData.length==0){
            return setErrorRes(res, setErrorRes(RESPONSE.NOT_FOUND, "department Data"));
        }
        departmentData = (departmentData || []).map((itm) => ({
            ...itm,
          }));
          

        return send(res,RESPONSE.SUCCESS,departmentData);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;