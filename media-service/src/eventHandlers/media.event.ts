import Media from "../models/Media";
import { deleteCloudinary } from "../utils/cloudinary";
import { logger } from "../utils/logger";

interface PostType {
    postId: string;
    userId: string;
    mediaIds: string[];
}

const handlePostDeleted = async(event:PostType)=> {
    console.log(event, 'eventevent');
    const {userId, postId, mediaIds} = event 
    try {
        const mediaToDelete = await Media.find({_id: {$in: mediaIds}})
        for(const media of mediaToDelete){
            await deleteCloudinary(media.publicId)
            await Media.findByIdAndDelete(media._id);

            logger.info(`Deleted media ${media.id} associated with this deleted post ${postId}`)
        }
        logger.info(`Processed deletion of media for post id ${postId}`) 

    } catch (error) {
        logger.error('Error occured whilte media deleted', error)
    }
    
}


export {
    handlePostDeleted
}