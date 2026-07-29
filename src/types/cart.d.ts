import { ProductType } from "@/types/product";
import { Types } from "mongoose";

export interface CartModel {
    user: Types.ObjectId;
    productId: string;
    price: number;
    total: number;
    quantity: number;
}

export interface CartItem extends CartModel {
    _id: string;
    user: string;
    product?: ProductType;
    __v?: number;
}
