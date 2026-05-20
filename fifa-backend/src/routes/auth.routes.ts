import { Router } from "express";
import { register, login, oauthLogin } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/oauth", oauthLogin);

export default router;