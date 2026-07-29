import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShippingAddress } from "@/types/order";

interface ShippingFormProps {
    shippingAddress: ShippingAddress;
    onShippingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNextStep: () => void;
    isShippingComplete: boolean;
}

export default function ShippingForm({
    shippingAddress,
    onShippingChange,
    onNextStep,
    isShippingComplete,
}: ShippingFormProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                        id="fullName"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={onShippingChange}
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input
                        id="streetAddress"
                        name="streetAddress"
                        value={shippingAddress.streetAddress}
                        onChange={onShippingChange}
                        placeholder="123 Main St, Apt 4B"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            value={shippingAddress.city}
                            onChange={onShippingChange}
                            placeholder="New York"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="state">State / Province</Label>
                        <Input
                            id="state"
                            name="state"
                            value={shippingAddress.state}
                            onChange={onShippingChange}
                            placeholder="NY"
                            required
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal / Zip Code</Label>
                        <Input
                            id="postalCode"
                            name="postalCode"
                            value={shippingAddress.postalCode}
                            onChange={onShippingChange}
                            placeholder="10001"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                            id="country"
                            name="country"
                            value={shippingAddress.country}
                            onChange={onShippingChange}
                            placeholder="United States"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number (for delivery updates)</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={shippingAddress.phoneNumber}
                        onChange={onShippingChange}
                        placeholder="(123) 456-7890"
                        required
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button onClick={onNextStep} disabled={!isShippingComplete}>
                    Continue to Payment
                </Button>
            </CardFooter>
        </Card>
    );
}
