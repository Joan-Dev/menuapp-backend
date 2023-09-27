// Dependencies
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rol"
    },
    token: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

// Hash password once
userSchema.pre('save', async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    const saltRounds = 10;
    const generateSalt = await bcrypt.genSaltSync(saltRounds);
    this.password = await  bcrypt.hashSync(this.password, generateSalt);
});

userSchema.methods.verifyPassword = async function(passwordForm) {
    return await bcrypt.compareSync(passwordForm, this.password);
}

const User = mongoose.model("User", userSchema);
export default User;

