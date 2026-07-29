// model/cart.ts

import { CartModel } from "@/types/cart";
import { Schema, models, model } from "mongoose";

const CartItemSchema = new Schema<CartModel>(
    {
        productId: { type: String, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true, default: 0 },
        quantity: { type: Number, required: true, min: 1 },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true, versionKey: false }
);

const CartItemModel = models.CartItem || model<CartModel>("CartItem", CartItemSchema);
export default CartItemModel;
