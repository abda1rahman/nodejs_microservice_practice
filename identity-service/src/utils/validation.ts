import Joi from "joi"

export const validateRegisration = (data:any) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(data);
}