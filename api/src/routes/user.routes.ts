import { Router } from "express";
import { getUserInfo } from "../controllers/user.controller";
import multer from "multer";

const router = Router();

const upload = multer();
router.get("/userinfo", upload.array('files'), getUserInfo);

export default router;
