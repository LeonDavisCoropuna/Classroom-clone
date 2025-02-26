import { Router } from "express";
import { getUserData, googleCallback, googleUrl, logout } from "../controllers/auth.controller";
import { refreshTokenMiddleware } from "../middleware/refreshTokenMiddleware";

const router = Router();

router.get("/callback/google", googleCallback);
router.get("/google", refreshTokenMiddleware ,getUserData); // get user
router.post("/google", googleUrl); // get url
router.post("/logout", logout);
export default router;
