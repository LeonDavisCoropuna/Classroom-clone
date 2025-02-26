import { Router } from "express";
import multer from "multer";
import { createSubmission, getTaskSubmission } from "../controllers/submission.controller";
const router = Router();

const upload = multer();
router.post("/", upload.array("files"), createSubmission);
router.post("/get-submission", getTaskSubmission)

export default router;
