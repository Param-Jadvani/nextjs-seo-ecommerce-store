import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-6">
                <Alert variant="default">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Page Not Found</AlertTitle>
                    <AlertDescription>
                        The login page you’re looking for doesn’t exist.
                    </AlertDescription>
                </Alert>
                <Button asChild className="mt-4 w-full">
                    <Link href="/login">Go to Login</Link>
                </Button>
            </div>
        </div>
    );
}
