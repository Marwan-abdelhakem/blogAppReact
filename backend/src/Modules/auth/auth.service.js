import successResponse from "../../Utlis/successRespone.utlis.js"
import UserModel from "../../DB/model/User.model.js";
import { comparePassowrd, hashPassword } from "../../Utlis/hash.utlis.js";
import { signToken, verifyTokin } from "../../Utlis/token.utlis.js";

export const signUp = async (req, res, next) => {
    try {
        const { user_name, email, password, bio } = req.body

        const existing = await UserModel.findOne({ email })
        if (existing) {
            return next(new Error("Email already exists", { cause: 400 }))
        }

        const hashedPassword = await hashPassword({ plainText: password })

        const createUser = await UserModel.create({
            user_name,
            email,
            password: hashedPassword,
            bio,
        })

        return successResponse({
            res,
            statusCode: 201,
            message: "User created successfully",
            data: createUser,
        })
    } catch (err) {
        // MongoDB duplicate key on email (race condition or missing unique index)
        if (err.code === 11000) {
            return next(new Error("Email already exists", { cause: 400 }))
        }
        return next(err)
    }
}

export const login = async (req, res, next) => {
    try {
        const oldToken = req.cookies.accessToken;

        if (oldToken) {
            try {
                const decoded = verifyTokin({ token: oldToken });
                if (decoded) {
                    return next(new Error("You are already logged in!", { cause: 400 }));
                }
            } catch {
                // token expired or invalid — allow login to proceed
            }
        }

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) {
            return next(new Error("User not found", { cause: 404 }));
        }

        const isMatch = await comparePassowrd({ plainText: password, hashPassword: user.password });
        if (!isMatch) {
            return next(new Error("Invalid password", { cause: 400 }));
        }

        const tokenPayload = { payload: { _id: user._id }, options: { expiresIn: "7d", issuer: "PostApp", subject: "Authentication" } };
        const accessToken = signToken(tokenPayload);
        const refreshToken = signToken(tokenPayload);

        const cookieBase = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        };

        res.cookie("accessToken", accessToken, { ...cookieBase, maxAge: 24 * 60 * 60 * 1000 });
        res.cookie("refreshToken", refreshToken, { ...cookieBase, maxAge: 7 * 24 * 60 * 60 * 1000 });

        return successResponse({
            res,
            statusCode: 200,
            message: "Login successfully",
            data: { accessToken, refreshToken },
        });
    } catch (err) {
        return next(err)
    }
}

export const logout = async (req, res, next) => {
    try {
        const cookieBase = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        };

        res.clearCookie("accessToken", cookieBase);
        res.clearCookie("refreshToken", cookieBase);

        return successResponse({ res, statusCode: 200, message: "Logout successful", data: {} });
    } catch (err) {
        return next(err)
    }
}

export const getMe = async (req, res, next) => {
    try {
        const { id } = req.params

        const user = await UserModel.findById(id)
        if (!user) {
            return next(new Error("User not found", { cause: 404 }));
        }

        return successResponse({ res, statusCode: 200, message: "Successfully", data: user })
    } catch (err) {
        return next(err)
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        const { id } = req.params
        const { user_name, bio } = req.body

        const user = await UserModel.findByIdAndUpdate(
            id,
            { $set: { user_name, bio } },
            { new: true }
        )
        if (!user) {
            return next(new Error("User not found", { cause: 404 }))
        }

        return successResponse({ res, statusCode: 200, message: "Profile updated successfully", data: user })
    } catch (err) {
        return next(err)
    }
}
