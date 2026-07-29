import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PaymentFormProps {
  onNextStep: () => void;
  onPrevStep: () => void;
  isPaymentComplete: boolean;
}

export default function PaymentForm({
  onNextStep,
  onPrevStep,
  isPaymentComplete,
}: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
          Secure payment is handled by Razorpay on the review step. No card data is stored in this
          app.
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>
          Back to Shipping
        </Button>
        <Button onClick={onNextStep} disabled={!isPaymentComplete}>
          Continue to Review
        </Button>
      </CardFooter>
    </Card>
  );
}
