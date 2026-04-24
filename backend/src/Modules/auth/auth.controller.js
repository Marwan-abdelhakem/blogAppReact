import { Router } from "express";
import * as authService from "./auth.service.js"
import { validation } from "../../Middelwares/validation.middelwares.js"
import { signUpValidation } from "./auth.validation.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js"


const router = Router();

router.post("/signUP", validation(signUpValidation), authService.signUp)

router.post("/login", authService.login)

router.post("/logout", authService.logout)

router.get("/getMe/:id", authentication, authService.getMe)

router.patch("/updateProfile/:id", authentication, authService.updateProfile)

export default router