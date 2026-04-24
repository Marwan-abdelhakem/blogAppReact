import mongoose, { Schema } from "mongoose"

const UserSchema = new Schema(
    {
        role: {
            type: String,
            enum: ["User", "Admin"]
        },

        user_name: {
            type: String,
            required: true,
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [20, "Name must be at most 20 characters long"],
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        bio: {
            type: String,
        }
    },
    {
        timestamps: true
    }
)

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema)

export default UserModel