import { response, Router } from "express"
const router = Router();
import departmentModel from "../../models/departmentModel.js";
import { RESPONSE } from "../../config/global.js";
import {send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import { authenticate } from "../../middlewares/authenticate.js";

router.delete("/",authenticate, async (req, res) => {
    try {
       let department_id = req.query.department_id;
       if (!department_id || department_id == undefined) {
                   return send(res, setErrorRes(RESPONSE.REQUIRED,"department_id"));
               }
         let departmentData = await departmentModel.aggregate([
                   {
                $match :{ $expr : { $eq : ["$_id", {$toObjectId: department_id}] }, 
                isactive: STATE.ACTIVE,
            },
            },
         ]);

         if(departmentData.length === 0){
            return send(res, setErrorRes(RESPONSE.NOT_FOUND, "department data"));
         }

        console.log(departmentData);

    await departmentModel.deleteOne({
        _id: department_id,
 
});

    return send(res,RESPONSE.SUCCESS);
    } catch (error) {
        console.log(error);
        return send(res, RESPONSE.UNKNOWN_ERR);
    }
});
export default router;