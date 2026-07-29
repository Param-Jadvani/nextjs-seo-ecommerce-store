'use server';

import DBConnect from '@/lib/db';
import Order from '@/model/Order';
import { Types } from 'mongoose';
import { OrderItem, OrderModel } from '@/types/order';
import { callbackAuth } from '@/helper/helper';

interface SerializedOrderItem extends OrderModel {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

function serializeOrderItem(item: SerializedOrderItem): OrderItem {
  return {
    _id: item._id.toString(),
    user: item.user.toString(),
    items: item.items,
    shippingAddress: item.shippingAddress,
    paymentInfo: item.paymentInfo,
    total: item.total,
    status: item.status,
    createdAt: item.createdAt,
  };
}

// CREATE ORDER
export const createOrder = callbackAuth(
  async (user, data: Omit<OrderItem, '_id' | 'user' | 'status'>) => {
    await DBConnect();

    const newOrder = await Order.create({
      user: user.id,
      items: data.items,
      shippingAddress: data.shippingAddress,
      total: data.total,
      paymentInfo: {
        razorpayOrderId: data.paymentInfo.razorpayOrderId,
        expectedAmountPaise: data.paymentInfo.expectedAmountPaise,
      },
      status: 'payment-pending',
    });

    return {
      success: true,
      message: 'Order created',
      order: JSON.parse(JSON.stringify(serializeOrderItem(newOrder))),
    };
  },
);

// GET ORDERS
export const getOrders = callbackAuth(async (user) => {
  await DBConnect();

  const orders = (await Order.find({
    user: user.id,
  })
    .sort({
      createdAt: -1,
    })
    .lean()) as SerializedOrderItem[];

  return {
    success: true,
    orders: orders.map(serializeOrderItem),
  };
});

// UPDATE ORDER
export const updateOrder = callbackAuth(
  async (user, orderId: string, updatedData: Partial<OrderItem>) => {
    await DBConnect();

    const savedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        user: user.id,
      },
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!savedOrder) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    return {
      success: true,
      order: serializeOrderItem(savedOrder as SerializedOrderItem),
    };
  },
);

// CANCEL ORDER
export const cancelOrder = callbackAuth(async (user, orderId: string) => {
  await DBConnect();

  const updatedOrder = await Order.findOneAndUpdate(
    {
      _id: orderId,
      user: user.id,
    },
    {
      status: 'cancelled',
    },
    {
      new: true,
    },
  );

  if (!updatedOrder) {
    return {
      success: false,
      error: 'Order not found or does not belong to user',
    };
  }

  return {
    success: true,
    order: serializeOrderItem(updatedOrder as SerializedOrderItem),
  };
});

export const updatePaymentInfo = callbackAuth(
  async (
    user,
    orderId: string,
    paymentInfo: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    },
  ) => {
    await DBConnect();

    const existingOrder = await Order.findOne({
      _id: orderId,
      user: user.id,
    });

    if (!existingOrder) {
      return {
        success: false,
        error: 'Order not found',
      };
    }

    if (paymentInfo.razorpayOrderId !== existingOrder.paymentInfo.razorpayOrderId) {
      return {
        success: false,
        error: 'Invalid payment order ID',
      };
    }

    if (
      existingOrder.paymentInfo?.razorpayPaymentId &&
      existingOrder.status === 'payment-done'
    ) {
      return {
        success: true,
        order: JSON.parse(JSON.stringify(existingOrder)),
      };
    }

    existingOrder.paymentInfo = paymentInfo;
    existingOrder.status = 'payment-done';

    await existingOrder.save();

    return {
      success: true,
      order: JSON.parse(JSON.stringify(existingOrder)),
    };
  },
);
