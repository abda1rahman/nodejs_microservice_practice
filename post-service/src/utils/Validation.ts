import Joi from "joi";

export const validateCreatePost = Joi.object({
    content: Joi.string().required(),
})
