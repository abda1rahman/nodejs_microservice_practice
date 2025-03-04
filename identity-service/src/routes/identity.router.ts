import { Router } from "express";
import { registerUser } from "../controller/identity.controller.js";

const router = Router();

router.post('/register', registerUser)

export {router}