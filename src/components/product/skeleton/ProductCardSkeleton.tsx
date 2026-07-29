import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden pt-0">
            <div className="h-52 bg-muted flex items-center justify-center">
                <Skeleton className="h-40 w-4/5" />
            </div>
            <CardHeader>
                <Skeleton className="h-6 w-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    );
}
