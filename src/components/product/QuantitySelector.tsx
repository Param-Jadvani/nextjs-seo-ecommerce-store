'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="font-medium">Quantity:</div>
      <div className="flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Minus size={14} />
        </Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
}
