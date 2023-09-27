// Dependencies
import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  numberOrder: {
    type: String,
    default: Date.now(),
    trim: true,
  },
  state: {
    type: String,
    default: "enviado",
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  waiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tables",
  },
  meals: [
    {
      mealId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meals",
  
      },
      amount: {
        type: Number,
        default: 1
      },
      priceMeal: {
        type: Number,
        default: 0
      },
      check: {
        type: Boolean,
        default: false
      }
    }
  ],
  currency: {
    type: String,
    default: "$",
  },
  subtotal: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  finished:{
    type: Boolean,
    default: false
  }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
