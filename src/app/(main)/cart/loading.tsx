import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-dropdown-menu";

export default function CartLoadingSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 animate-pulse">
            <Skeleton className="h-8 w-1/4 mb-6" /> {/* Back button skeleton */}
            <Skeleton className="h-10 w-1/3 mb-8" /> {/* Title skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Items Skeleton */}
                <div className="lg:col-span-2 space-y-4">
                    {[...Array(2)].map(
                        (
                            _,
                            i // Skeleton for 2 items
                        ) => (
                            <Card key={i} className="shadow-sm">
                                <CardHeader>
                                    <Skeleton className="h-6 w-1/2" />
                                </CardHeader>
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start gap-4">
                                    <Skeleton className="h-24 w-24 rounded flex-shrink-0" />
                                    <div className="flex-grow space-y-3">
                                        <Skeleton className="h-5 w-full" />
                                        <Skeleton className="h-6 w-1/4" />
                                        <div className="flex justify-between items-center pt-1">
                                            <Skeleton className="h-8 w-24 rounded-md" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
                {/* Summary Skeleton */}
                <div className="lg:col-span-1">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Separator className="my-3" />
                            <Skeleton className="h-6 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-12 w-full rounded-md" />
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
