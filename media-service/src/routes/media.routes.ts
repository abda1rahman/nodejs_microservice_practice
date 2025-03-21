import { Router } from "express";
import { logger } from "../utils/logger";
import multer from 'multer'
import { authenticated } from "../middleware/authMiddleware";
import { AppError } from "../utils/AppError";
import { uploadMedia } from "../controllers/media.controller";
import { asyncHandler } from "../utils/asyncHandler";


const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
}).single('file')

router.post('/upload', authenticated, asyncHandler(async (req, res, next)=> {
    console.log(req.file)
    await upload(req, res, function(err){
        if(err instanceof multer.MulterError){
            logger.error('Multer error while uploading')
            throw new AppError('Multer error while uploading', 400)
        }else if(err){
            logger.error('unknown error occure while uploading', err)
            throw new AppError('unknown error occure while uploading', 400)
        }
        next()
    })

}),uploadMedia)

export default router;