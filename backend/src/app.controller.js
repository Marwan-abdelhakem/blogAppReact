import cookieParser from "cookie-parser"
import cors from "cors"
import connectDb from "./DB/connectDB.js"
import authRouter from "./Modules/auth/auth.controller.js"
import postRouter from "./Modules/Post/post.controller.js"
import globalErrorHandler from "./Utlis/errorHandler.utlis.js"


const bootStrap = async (app, express) => {
    app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    }))

    app.use(express.json())
    app.use(cookieParser());
    await connectDb()

    app.use("/api/auth", authRouter)
    app.use("/api/post", postRouter)


    app.all("/*dummy", (req, res, next) => {
        return next(new Error("Not found Handler !!!!", { cause: 409 }))
    })

    app.use(globalErrorHandler)
}

export default bootStrap