import { Router } from "express";
import { createCourse, getCourses, getCourseById , joinRoom, getPersonsByCourse } from "../controllers/course.controller";
import { createAnnounce, getAnnounces } from "../controllers/announce.controller";
import multer from "multer";
const router = Router();

router.get("/", getCourses);
router.post("/", createCourse);
router.get("/announces", getAnnounces)
router.get("/persons", getPersonsByCourse);

router.post("/join-room", joinRoom)

const upload = multer();
router.post("/announces", upload.array('files') ,createAnnounce)

router.get("/:id", getCourseById);

export default router;
