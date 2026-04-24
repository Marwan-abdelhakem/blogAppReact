import { Router } from "express";
import * as postService from "./post.service.js"
import { authentication, authorization } from "../../Middelwares/auth.middlewares.js"
import { validation } from "../../Middelwares/validation.middelwares.js"
import { postValidation } from "./post.validation.js";

const router = Router()

router.post("/createPost", authentication, validation(postValidation), postService.createPost)

router.get("/getAllYourPosts", authentication, postService.getAllYourPosts)

router.patch("/updatePosts/:id", authentication, postService.updatePosts)
router.put("/updatePosts/:id", authentication, postService.updatePosts)

router.delete("/deletePost/:id", authentication, postService.deletePost)

router.delete("/deletePostAdmin/:id", authentication, authorization({ role: ["Admin"] }), postService.deletePost)

router.get("/getOnePost/:id", authentication, postService.getOnePost)

router.get("/user/:userId", authentication, postService.getPostsByUser)

router.get("/getAllPosts", authentication, postService.getAllPosts)






export default router