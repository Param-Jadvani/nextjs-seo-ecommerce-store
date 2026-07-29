'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Package,
  Calendar,
  ArrowLeft,
  MapPin,
  CreditCard,
  Edit,
  AlertTriangle,
} from 'lucide-react';
import userOrderStore from '@/store/userOrderStore';
import userStore from '@/store/userStore';
import { cancelOrder, updateOrder } from '@/actions/order/order';
import { toast } from 'sonner';
import Image from 'next/image';
import { ShippingAddress } from '@/types/order';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { orders, updateOrder: updateOrderInStore } = userOrderStore((s) => s);
  const { user } = userStore((s) => s);
  const order = orders.find((o) => o._id === id);

  const [updatedAddress, setUpdatedAddress] = useState<ShippingAddress>(
    order?.shippingAddress || {
      fullName: '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      phoneNumber: '',
    },
  );

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAddress = async () => {
    if (!order) return;
    const updatedData = {
      ...order,
      shippingAddress: updatedAddress,
    };

    try {
      const result = await updateOrder(order._id, updatedData);

      if (!result.success) return toast.error(result.error ?? 'Failed to update order');

      updateOrderInStore(result.order as typeof order);
      toast.success('Address updated');
      return;
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('An error occurred during order update.');
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !user) return;
    try {
      const result = await cancelOrder(order._id);
      if (result.success) {
        updateOrderInStore({ ...order, status: 'cancelled' });
        toast.success('Order cancelled');
      } else {
        toast.error(result.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error('An error occurred during order placement.');
    }
  };

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
        <p className="mb-4">The order you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    const parsedDate = date instanceof Date ? date : new Date(date);

    if (parsedDate instanceof Date && !isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
    } else {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const subtotal = order.items.reduce((sum, item) => sum + item.total, 0);
  const shipping = subtotal > 0 ? (subtotal > 50 ? 0 : 5.99) : 0;
  const tax = subtotal * 0.07;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Package size={24} className="mr-2" />
            Order Details
          </h1>
          <p className="text-muted-foreground mt-1">Order ID: {order._id}</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft size={14} className="mr-1" />
              Back to Orders
            </Link>
          </Button>
          {order.status !== 'cancelled' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <AlertTriangle size={14} className="mr-1" />
                  Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will cancel your order and it cannot be
                    processed further.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Order</AlertDialogCancel>
                  <AlertDialogAction onClick={handleCancelOrder}>
                    Yes, Cancel Order
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-3">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <Badge className={`text-sm ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <Separator orientation="vertical" className="mx-4 h-6" />
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>Ordered on {formatDate(order.createdAt || new Date())}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="font-bold text-2xl">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="h-20 w-20 bg-muted rounded flex-shrink-0 flex items-center justify-center">
                      {item.product?.image && (
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          width={80}
                          height={80}
                          className="object-contain p-2"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.product?.title}</h4>
                      <div className="flex justify-between items-end mt-1">
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        <p className="font-semibold">${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-muted">
              <div className="space-y-1">
                <p className="text-sm">Subtotal</p>
                <p className="text-sm">Shipping</p>
                <p className="text-sm">Tax</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-sm">${subtotal.toFixed(2)}</p>
                <p className="text-sm">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</p>
                <p className="text-sm">${tax.toFixed(2)}</p>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <MapPin size={18} className="mr-2" />
                Shipping Address
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" disabled={order.status === 'cancelled'}>
                    <Edit size={16} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Shipping Address</DialogTitle>
                    <DialogDescription>
                      Make changes to your shipping address here.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={updatedAddress.fullName}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="streetAddress">Street Address</Label>
                      <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={updatedAddress.streetAddress}
                        onChange={handleAddressChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={updatedAddress.city}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={updatedAddress.state}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={updatedAddress.postalCode}
                          onChange={handleAddressChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={updatedAddress.country}
                          onChange={handleAddressChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={updatedAddress.phoneNumber}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpdateAddress}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.streetAddress}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>Phone: {order.shippingAddress.phoneNumber}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard size={18} className="mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Status: {order.status === 'payment-done' ? 'Paid' : 'Pending payment'}</p>
                <p>Razorpay Order ID: {order.paymentInfo?.razorpayOrderId || 'N/A'}</p>
                <p>Razorpay Payment ID: {order.paymentInfo?.razorpayPaymentId || 'Pending'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
