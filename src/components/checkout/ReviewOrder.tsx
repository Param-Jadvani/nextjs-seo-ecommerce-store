import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ShippingAddress } from '@/types/order';

interface CartItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
  product?: {
    image?: string;
    title?: string;
  };
}

interface ReviewOrderProps {
  shippingAddress: ShippingAddress;
  cart: CartItem[];
  onPrevStep: () => void;
  onPlaceOrder: () => void;
  onEditShipping: () => void;
  isPlacingOrder: boolean;
  total: number;
}

export default function ReviewOrder({
  shippingAddress,
  cart,
  onPrevStep,
  onPlaceOrder,
  onEditShipping,
  isPlacingOrder,
  total,
}: ReviewOrderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Your Order</CardTitle>
        <CardDescription>
          Please check everything carefully before placing your order.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
            Shipping To
            <Button variant="outline" size="sm" onClick={onEditShipping}>
              <Edit size={14} className="mr-1" /> Edit
            </Button>
          </h3>
          <div className="bg-muted p-4 rounded-md text-sm space-y-1">
            <p>{shippingAddress.fullName}</p>
            <p>{shippingAddress.streetAddress}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode},{' '}
              {shippingAddress.country}
            </p>
            <p>Phone: {shippingAddress.phoneNumber}</p>
          </div>
        </div>
        <div className="bg-muted p-4 rounded-md text-sm space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Payment Method</h3>
          </div>
          <p>Secure checkout will open Razorpay in a modal after you place the order.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Items ({cart.length})</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center gap-4 text-sm">
                <div className="h-16 w-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center p-1 border">
                  {item.product?.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.title || 'Product'}
                      width={60}
                      height={60}
                      className="object-contain mix-blend-multiply"
                    />
                  ) : (
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-medium line-clamp-2">{item.product?.title || 'Loading...'}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium whitespace-nowrap">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button variant="outline" onClick={onPrevStep}>
          Back to Payment
        </Button>
        <Button
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || cart.length === 0}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isPlacingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isPlacingOrder ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
        </Button>
      </CardFooter>
    </Card>
  );
}
