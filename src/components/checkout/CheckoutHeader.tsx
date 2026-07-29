

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CheckoutHeaderProps {
    onBackToCart: () => void;
}

export default function CheckoutHeader({ onBackToCart }: CheckoutHeaderProps) {
    return (
        <div className="mb-6">
            <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 flex items-center"
                onClick={onBackToCart}
            >
                <ArrowLeft size={18} className="mr-2" />
                Back to Cart
            </Button>
        </div>
    );
}
