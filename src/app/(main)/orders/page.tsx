"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, ExternalLink, Calendar, Clock } from "lucide-react";
import userOrderStore from "@/store/userOrderStore";
import Image from "next/image";

export default function OrdersPage() {
    const { orders } = userOrderStore((s) => s);

    const formatDate = (date: Date) =>
        date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "processing":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "shipped":
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order._id}>
                            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div>
                                    <CardTitle className="flex items-center">
                                        <span>Order {order._id}</span>
                                    </CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                        <Calendar size={14} className="mr-1" />
                                        {formatDate(order.createdAt || new Date())}
                                        <Separator orientation="vertical" className="mx-2 h-4" />
                                        <Clock size={14} className="mr-1" />
                                        {order.createdAt?.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </CardDescription>
                                </div>
                                <div className="mt-2 sm:mt-0 flex gap-2">
                                    <Badge className={getStatusColor(order.status)}>
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1)}
                                    </Badge>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/orders/${order._id}`}>
                                            <ExternalLink size={14} className="mr-1" />
                                            View Details
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-4">
                                        {order.items.slice(0, 4).map((item) => (
                                            <div
                                                key={item.productId}
                                                className="flex items-center gap-2"
                                            >
                                                <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                                                    {item.product?.image && (
                                                        <Image
                                                            src={item.product.image}
                                                            alt={item.product.title}
                                                            width={48}
                                                            height={48}
                                                            className="object-contain p-1"
                                                        />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium truncate w-32">
                                                        {item.product?.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 4 && (
                                            <Badge variant="outline" className="self-center">
                                                +{order.items.length - 4} more items
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t">
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                <span className="font-medium">
                                                    Shipping Address:
                                                </span>{" "}
                                                {order.shippingAddress.city},{" "}
                                                {order.shippingAddress.state}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Total Items:</span>{" "}
                                                {order.items.reduce(
                                                    (sum, item) => sum + item.quantity,
                                                    0
                                                )}
                                            </p>
                                        </div>
                                        <div className="mt-2 sm:mt-0 text-right">
                                            <p className="text-sm text-muted-foreground">
                                                Order Total
                                            </p>
                                            <p className="font-bold text-lg">
                                                ${order.total.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <Package size={64} className="text-muted-foreground" />
                            <h2 className="text-xl font-semibold">No orders yet</h2>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                You haven&apos;t placed any orders yet. Start shopping to see your
                                orders here.
                            </p>
                            <Button asChild>
                                <Link href="/products">Start Shopping</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
