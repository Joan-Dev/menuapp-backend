// Dependencies
import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
// Helpers
import generateUniqueId from "../helpers/generateUniqueId.js";

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rol",
    },
    token: {
        type: String,
        default: generateUniqueId()
    },
    verified: {
        type: Boolean,
        default: false
    },
    profile: {
        nameRest: {
            type: String,
            default: null
        },
        imageIcon: {
            type: String,
            default: null
        },
        imageLogo: {
            type: String,
            default: null
        },
        description: {
            type:  String,
            default: null,
        }
    },
});

// Hash password once
adminSchema.pre('save', async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    const saltRounds = 10;
    const generateSalt = await bcrypt.genSaltSync(saltRounds);
    this.password = await  bcrypt.hashSync(this.password, generateSalt);
});

adminSchema.methods.verifyPassword = async function(passwordForm) {
    return await bcrypt.compareSync(passwordForm, this.password);
}

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

