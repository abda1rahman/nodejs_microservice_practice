import { v2 as cloudinary } from "cloudinary";
import { logger } from "./logger";
import { AppError } from "./AppError";
import stream from "stream";
import "dotenv/config";
import { asyncHandler } from "./asyncHandler";

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadMediaToCloudinary(file) {

    // Create a readable stream from the file buffer
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {resource_type: "auto", folder: 'microservice'},
        (error, result: any) => {
          if (error) {
            logger.error("error occue whilte upload to cloudinary", error);
            reject(new AppError("error occue whilte upload to cloudinary", 400));
          }
          logger.info("File uploaded successfully");
          resolve(result);
        }
      );
    
      uploadStream.end(file.buffer);
    })
    
}

export async function deleteCloudinary(public_id){
  try {
    await cloudinary.uploader.destroy(public_id)
    logger.info('Media deleted successfully from cloud storage', public_id)
  } catch (error) {
    logger.error('Error deleting from cloudinary', error)
  }
}