import { Router } from "express";
import { registerUser } from "../controller/identity.controller";

const router = Router();

router.post('/register', registerUser)

export default router;