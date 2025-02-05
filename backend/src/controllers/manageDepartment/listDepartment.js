import { Router } from "express";
const router = Router();
import departmentModel from "../../models/departmentModel.js";
import { RESPONSE } from "../../config/global.js";
import { send, setErrorRes } from "../../helper/responseHelper.js";
import { STATE } from "../../config/constants.js";
import mongoose from "mongoose";

router.get("/", async (req, res) => {
  try {
    let name = req.query.name;
    let query = {};
    let department_id = req.query.department_id;

    if (name != undefined) {
      query.name = name;
    }

    if (department_id != undefined) {
      query.$expr = { $eq: ["$_id", { $toObjectId: department_id }] };
    }

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

    if (departmentData.length == 0) {
      return send(res, setErrorRes(RESPONSE.NOT_FOUND, "department Data"));
    }

    departmentData = (departmentData || []).map((itm) => ({
      ...itm,
    }));

    return send(res, RESPONSE.SUCCESS, departmentData);
  } catch (error) {
    console.log(error);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

router.put("/", async (req, res) => {
  try {
    let department_id = req.query.department_id;
    let { name, description, courses } = req.body;
    let updates = {};

    if (!department_id || department_id == undefined) {
      return send(res, setErrorRes(RESPONSE.REQUIRED, "department_id"));
    }

    let departmentData = await departmentModel.aggregate([
      {
        $match: {
          $expr: { $eq: ["$_id", { $toObjectId: department_id }] },
          isactive: STATE.ACTIVE,
        },
      },
    ]);

    if (departmentData.length === 0) {
      return send(res, setErrorRes(RESPONSE.NOT_FOUND, "department data"));
    }

    if (name && name != undefined) {
      let isExist = await departmentModel.aggregate([
        {
          $match: {
            name: name,
            isactive: STATE.ACTIVE,
          },
        },
      ]);

      if (isExist.length > 0) {
        return send(res, setErrorRes(RESPONSE.ALREADY_EXISTS, "name"));
      }

      updates.name = name;
    }

    if (description && description != undefined) {
      updates.description = description;
    }

    if (courses && courses != undefined) {
      updates.courses = courses.split(',').map(course => mongoose.Types.ObjectId(course.trim()));
    }

    await departmentModel.updateMany(
      { _id: mongoose.Types.ObjectId(department_id) },
      {
        $set: updates,
      }
    );

    return send(res, RESPONSE.SUCCESS);
  } catch (error) {
    console.log(error);
    return send(res, RESPONSE.UNKNOWN_ERR);
  }
});

export default router;