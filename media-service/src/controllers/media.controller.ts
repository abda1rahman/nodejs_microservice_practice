import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/logger";
import { AppError } from "../utils/AppError";
import { deleteCloudinary, uploadMediaToCloudinary } from "../utils/cloudinary";
import Media from "../models/Media";
import mongoose, { Types } from "mongoose";

const uploadMedia = asyncHandler(async(req, res):Promise<any>=> {
    logger.info('Starting media upload')
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

const deleteMedia = asyncHandler(async(req, res)=> {
  const id = req.params.id;
  const userId =  req.user.userId;

  const media:any = await Media.findById(id);
  if(!media){
    return res.status(404).json({success: false, message: 'media not exist'})
  }
  if(media.userId.toString() !== userId.toString()){
    return res.status(401).json({success: false, message: 'You didn\'t have permession to delete this post'})
  }

  await deleteCloudinary(media.publicId)

  return res.status(200).json({success: true, message: 'post deleted successfully'});
})

const getAllMedia = asyncHandler(async(req, res)=> {

    const media = await Media.find();

    res.status(200).json({success: true, result: media})
})

export {
    uploadMedia,
    deleteMedia,
    getAllMedia
}