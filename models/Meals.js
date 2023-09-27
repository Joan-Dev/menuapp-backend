// Dependencies
import mongoose from "mongoose";

const mealsSchema = mongoose.Schema({
    nameMeal: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories"
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    currency: {
        type: String,
        required: true,
        default: '$'
    },
    ingredients: {
        type: String,
        required: true,
        trim: true
    },
    imageMeal: {
        type: String,
        required: true,
        trim: true,
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

const Meals = mongoose.model("Meals", mealsSchema);
export default Meals;

