// Dependencies
import mongoose from "mongoose";

const tableSchema = mongoose.Schema({
    numberTable: {
        type: String,
        required: true,
        trim: true
    },
    urlTable: {
        type: String,
        trim:true,
    },
    available: {
        type: Boolean,
        default: true
    },
    rol: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rol"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});

// , {
//     timestamps: true,
//    }


const Tables = mongoose.model("Tables", tableSchema);
export default Tables;

