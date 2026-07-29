
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    cartLength: number;
}

export default function OrderSummary({
    subtotal,
    shipping,
    tax,
    total,
    cartLength,
}: OrderSummaryProps) {
    return (
        <Card className="overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                        <span>Subtotal ({cartLength} items)</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                        <span>Estimated Tax (7%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex items-center justify-between text-lg font-bold text-gray-800">
                        <span>Order Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
