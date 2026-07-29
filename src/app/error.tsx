"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Link } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error("Global application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>An error occurred</AlertTitle>
                    <AlertDescription>
                        {error.message || "Something went wrong with the application."}
                    </AlertDescription>
                </Alert>
                <Button onClick={reset} className="mt-4 w-full" variant="outline">
                    Try again
                </Button>
                <Button asChild className="mt-2 w-full" variant="link">
                    <Link href="/">Go to Home</Link>
                </Button>
            </div>
        </div>
    );
}
