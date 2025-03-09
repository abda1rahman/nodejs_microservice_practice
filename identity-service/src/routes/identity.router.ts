import { Router } from "express";
import { loginUser, logoutUser, refreshTokenUser, registerUser } from "../controller/identity.controller";

const router = Router();

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/logout', logoutUser)

router.post('/refresh-token', refreshTokenUser)


export default router;