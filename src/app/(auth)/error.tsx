"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error("Login page error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Something went wrong</AlertTitle>
                    <AlertDescription>
                        {error.message || "An unexpected error occurred while loading the page."}
                    </AlertDescription>
                </Alert>
                <Button onClick={reset} className="mt-4 w-full" variant="outline">
                    Try again
                </Button>
            </div>
        </div>
    );
}
