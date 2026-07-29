// /actions/cart/cart.ts
'use server';

import DBConnect from '@/lib/db';
import CartItemModel from '@/model/Cart';
import { CartItem, CartModel } from '@/types/cart';
import { Types } from 'mongoose';
import { callbackAuth, fetchProduct } from '@/helper/helper';

interface SerializedCartItem extends CartModel {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

function serializeCartItem(item: SerializedCartItem): CartItem {
  return {
    _id: item._id.toString(),
    productId: item.productId,
    user: item.user.toString(),
    quantity: item.quantity,
    price: item.price,
    total: item.total,
    product: undefined,
  };
}

export const getUserCart = callbackAuth(async (user) => {
  await DBConnect();

  const cartItems = (await CartItemModel.find({
    user: user.id,
  }).lean()) as SerializedCartItem[];

  return { success: true, cart: cartItems.map(serializeCartItem) };
});

export const addToCart = callbackAuth(async (user, productId: string, quantity: number) => {
  const product = await fetchProduct(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const authoritativePrice = product.price;
  const total = authoritativePrice * quantity;

  await DBConnect();

  const existingItem = await CartItemModel.findOne({
    user: user.id,
    productId,
  });

  let savedItem: SerializedCartItem;
  let message: string;

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = total;

    savedItem = await existingItem.save();

    message = 'Quantity updated';
  } else {
    savedItem = await CartItemModel.create({
      user: user.id,
      productId,
      quantity,
      price: authoritativePrice,
      total,
    });

    message = 'Item added to cart';
  }

  return {
    success: true as const,
    message,
    item: serializeCartItem(savedItem),
  };
});

export const updateCartQuantity = callbackAuth(async (_, cartId: string, quantity: number) => {
  await DBConnect();
  const cartItem = await CartItemModel.findById(cartId);

  if (!cartItem) {
    return { success: false, error: 'Cart item not found' };
  }

  const updatedQuantity = Math.max(1, quantity);
  cartItem.quantity = updatedQuantity;
  cartItem.total = updatedQuantity * cartItem.price;

  const savedItem = (await cartItem.save()) as SerializedCartItem;

  return {
    success: true,
    message: 'Quantity updated',
    item: serializeCartItem(savedItem),
  };
});

export const removeFromCart = callbackAuth(async (_, cartId: string) => {
  await DBConnect();
  const itemToDelete: SerializedCartItem | null = await CartItemModel.findByIdAndDelete(cartId);

  if (!itemToDelete) {
    return { success: true, message: 'Item not found or already removed.' };
  }

  return {
    success: true,
    message: 'Item removed',
    item: serializeCartItem(itemToDelete),
  };
});

export const clearUserCart = callbackAuth(async (user) => {
  await DBConnect();
  const deleteResult = await CartItemModel.deleteMany({ user: user.id });
  return {
    success: true,
    message: `${deleteResult.deletedCount} items removed from cart.`,
  };
});
