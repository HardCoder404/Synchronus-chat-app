import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    },
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    }
})


// Decrypt the password: 
userSchema.pre("save", async function(next) {
    const salt = await genSalt();
    this.password = await hash(this.password,salt);
    next();
})


// creating models
const User = mongoose.model("Users",userSchema);

export default User;