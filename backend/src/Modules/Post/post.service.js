import successResponse from "../../Utlis/successRespone.utlis.js"
import UserModel from "../../DB/model/User.model.js";
import PostModel from "../../DB/model/Post.model.js";

export const createPost = async (req, res, next) => {
    try {
        const author = req.user._id
        const { title, content, coverImage } = req.body

        const post = await PostModel.create({ title, content, coverImage, author })

        return successResponse({ res, statusCode: 201, message: "Post created successfully", data: post })
    } catch (err) {
        return next(err)
    }
}

export const getAllYourPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find({})
            .populate('author', 'user_name email')
            .sort({ createdAt: -1 })

        return successResponse({ res, statusCode: 200, message: "Successfully", data: posts })
    } catch (err) {
        return next(err)
    }
}

export const updatePosts = async (req, res, next) => {
    try {
        const { id } = req.params;
        const authorId = req.user._id
        const { title, content, coverImage } = req.body

        const post = await PostModel.findById(id)
        if (!post) {
            return next(new Error("Post not found", { cause: 404 }));
        }

        if (post.author.toString() !== authorId.toString()) {
            return next(new Error("You are not the owner of this post", { cause: 403 }));
        }

        const updatedPost = await PostModel.findByIdAndUpdate(
            id,
            { $set: { title, content, coverImage } },
            { new: true }
        ).populate('author', 'user_name email')

        return successResponse({ res, statusCode: 200, message: "Post updated successfully", data: updatedPost })
    } catch (err) {
        return next(err)
    }
}

export const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params;
        const authorId = req.user._id

        // Verify the post exists and belongs to the requesting user
        const post = await PostModel.findById(id)
        if (!post) {
            return next(new Error("Post not found", { cause: 404 }));
        }

        if (post.author.toString() !== authorId.toString()) {
            return next(new Error("You are not the owner of this post", { cause: 403 }));
        }

        await PostModel.findByIdAndDelete(id)

        return successResponse({ res, statusCode: 200, message: "Post deleted successfully", data: post })
    } catch (err) {
        return next(err)
    }
}

export const getOnePost = async (req, res, next) => {
    try {
        const { id } = req.params

        const post = await PostModel.findById(id)
        if (!post) {
            return next(new Error("Post not found", { cause: 404 }));
        }

        return successResponse({ res, statusCode: 200, message: "Successfully", data: post })
    } catch (err) {
        return next(err)
    }
}

export const getPostsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params

        const posts = await PostModel.find({ author: userId })
            .populate('author', 'user_name email')
            .sort({ createdAt: -1 })

        return successResponse({ res, statusCode: 200, message: "Successfully", data: posts })
    } catch (err) {
        return next(err)
    }
}

export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await PostModel.find({})
            .populate('author', 'user_name email')
            .sort({ createdAt: -1 })

        return successResponse({ res, statusCode: 200, message: "Successfully", data: posts })
    } catch (err) {
        return next(err)
    }
}

export const deletePostAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedPost = await PostModel.findByIdAndDelete(id)
        if (!deletedPost) {
            return next(new Error("Post not found", { cause: 404 }));
        }

        return successResponse({ res, statusCode: 200, message: "Post deleted successfully", data: deletedPost })
    } catch (err) {
        return next(err)
    }
}
