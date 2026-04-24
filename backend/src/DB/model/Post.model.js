import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 5 characters long"],
        },

        content: {
            type: String,
            required: [true, "Content is required"],
        },

        coverImage: {
            type: String,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

const PostModel = mongoose.models.posts || mongoose.model("posts", PostSchema);

export default PostModel;