import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import Media from "../models/Media";

const uploadMedia = asyncHandler(async(req, res):Promise<any>=> {
    logger.info('Starting media upload')
    console.log(req.file)
    if(!req.file){
        logger.error('No file found. please try again.');
        throw new AppError('file not exist', 400)
    }
    
      const {originalname:originalName , mimetype, buffer}:any = req.file
      const userId = req.user.userId

      logger.info(`File details name=${originalName}, type=${mimetype}`)
      logger.info(`Uploading to cloudinary starting...`);

      const cloudinaryUploadResult:any = await uploadMediaToCloudinary(req.file);
      logger.info(`Cloudinary upload successfully. Public Id: - ${cloudinaryUploadResult.public_id}`)

      const newCreatedMedia = new Media({
        publicId: cloudinaryUploadResult.public_id,
        originalName,
        mimeType:mimetype,
        url :  cloudinaryUploadResult.secure_url,
        userId
      })

      await newCreatedMedia.save();

    //   res.cookies('mediaId', newCreatedMedia._id,{ maxAge: 24 * 60 * 60 * 1000})

      res.status(201).json({success: true, ressult: newCreatedMedia})

})

export {
    uploadMedia
}