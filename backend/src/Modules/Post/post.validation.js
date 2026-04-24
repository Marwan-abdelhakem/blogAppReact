import joi from "joi";

export const postValidation = joi.object({
    title: joi.string().min(3).required().messages({
        "string.min": "User name must be at least 3 characters long",
        "any.required": "Title is required"
    }),
    content: joi.string().required().messages({
        "any.required": "Title is required"
    }),
    // author: joi.string().required()
})