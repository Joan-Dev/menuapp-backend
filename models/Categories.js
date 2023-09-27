// Dependencies
import mongoose from "mongoose";

const categoriesSchema = mongoose.Schema({
    nameCategory: {
        type: String,
        required: true,
        trim: true
    },
    available: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    }
});



const Categories = mongoose.model("Categories", categoriesSchema);
export default Categories;

