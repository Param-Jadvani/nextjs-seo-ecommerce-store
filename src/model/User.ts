import { Schema, models, model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserModel } from "@/types/user";

// type UserModel = {
//     username: string;
//     email: string;
//     password: string;
//     comparePassword(password: string): Promise<boolean>;
// };

const UserSchema = new Schema<UserModel>(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            trim: true,
            select: false,
        },
    },
    { timestamps: true, versionKey: false }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.methods.comparePassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

const User = models.User || model<UserModel>("User", UserSchema);
export default User;
