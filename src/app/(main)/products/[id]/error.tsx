"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ProductDetailErrorPage({
    error,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Oops! Product Not Found</h1>
            <p className="text-lg text-gray-600 mb-4 max-w-md">
                We couldn&apos;t load the product details you were looking for.
                {error.message.includes("not found") &&
                    " It might have been removed or the link is incorrect."}
            </p>

            <div className="flex space-x-4">
                <Button asChild>
                    <Link href="/products">Back to Products</Link>
                </Button>
            </div>
        </div>
    );
}
