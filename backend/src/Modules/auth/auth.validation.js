import joi from "joi";

export const signUpValidation = joi.object({

    user_name: joi.string().min(3).max(20).required().messages({
        "string.min": "User name must be at least 3 characters long",
        "string.max": "User name must be at most 20 characters long",
        "any.required": "User name is required"
    }),
    email: joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required"
    }),
    password: joi.string()
        .min(6)
        .pattern(new RegExp(/[A-Z]/))
        .pattern(new RegExp(/[!@#$%^&*(),.?":{}|<>_\-]/))
        .required()
        .messages({
            "string.min": "Password must be at least 6 characters long",
            "string.pattern.base": "Password must contain at least one capital letter and one special character",
            "any.required": "Password is required",
            "string.empty": "Password cannot be empty"
        }),
    bio: joi.string().allow('').optional()
});