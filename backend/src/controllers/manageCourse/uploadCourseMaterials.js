// import { Router } from "express";
// import { RESPONSE } from "../../config/global.js";
// import { send, setErrorRes } from "../../helper/responseHelper.js";
// import { ROLE, STATE } from "../../config/constants.js";
// import { authenticate } from "../../middlewares/authenticate.js";
// import materialsModel from "../../models/materialsModel.js";
// import mongoose from "mongoose";

// const router = Router();

// // Route to handle PDF upload
// router.post("/upload/pdf", authenticate, async (req, res) => {
//   try {
//     // Check user role (if required)
//     if (req.user.role !== ROLE.ADMIN) {
//       return send(res, RESPONSE.UNAUTHORIZED);
//     }

//     const { pdfUrl } = req.body;
//     const user_id = req.user.id;

//     // Validate PDF URL
//     if (!pdfUrl || pdfUrl === undefined) {
//       return send(res, setErrorRes(RESPONSE.REQUIRED, "pdfUrl"));
//     }
//     if (!validator.isURL(pdfUrl) || !pdfUrl.endsWith(".pdf")) {
//       return send(res, setErrorRes(RESPONSE.INVALID, "pdfUrl"));
//     }

//     // Save material to the database
//     const newMaterial = await materialsModel.create({
//       type: "pdf",
//       content: pdfUrl,
//       user_id: user_id,
//       createdAt: new Date(),
//       isactive: STATE.ACTIVE,
//     });

//     return send(res, RESPONSE.SUCCESS, { material: newMaterial });
//   } catch (error) {
//     console.error(error);
//     if (!res.headersSent) {
//       return send(res, RESPONSE.UNKNOWN_ERR);
//     }
//   }
// });

// // Route to handle YouTube video upload
// router.post("/upload/video", authenticate, async (req, res) => {
//   try {
//     // Check user role (if required)
//     if (req.user.role !== ROLE.ADMIN) {
//       return send(res, RESPONSE.UNAUTHORIZED);
//     }

//     const { videoUrl } = req.body;
//     const user_id = req.user.id;

//     // Validate YouTube URL
//     const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
//     if (!videoUrl || videoUrl === undefined) {
//       return send(res, setErrorRes(RESPONSE.REQUIRED, "videoUrl"));
//     }
//     if (!youtubeRegex.test(videoUrl)) {
//       return send(res, setErrorRes(RESPONSE.INVALID, "videoUrl"));
//     }

//     // Save material to the database
//     const newMaterial = await materialsModel.create({
//       type: "video",
//       content: videoUrl,
//       user_id: user_id,
//       createdAt: new Date(),
//       isactive: STATE.ACTIVE,
//     });

//     return send(res, RESPONSE.SUCCESS, { material: newMaterial });
//   } catch (error) {
//     console.error(error);
//     if (!res.headersSent) {
//       return send(res, RESPONSE.UNKNOWN_ERR);
//     }
//   }
// });

// // Route to fetch all uploaded materials
// router.get("/getMaterials", authenticate, async (req, res) => {
//   try {
//     const materials = await materialsModel.find({ isactive: STATE.ACTIVE });

//     if (!materials || materials.length === 0) {
//       return send(res, RESPONSE.NOT_FOUND);
//     }

//     return send(res, RESPONSE.SUCCESS, { materials });
//   } catch (error) {
//     console.error(error);
//     if (!res.headersSent) {
//       return send(res, RESPONSE.UNKNOWN_ERR);
//     }
//   }
// });

// export default router;
