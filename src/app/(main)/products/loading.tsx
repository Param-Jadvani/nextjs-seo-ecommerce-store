import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 rounded-[2rem] border border-border/60 bg-gradient-to-br from-white via-slate-50 to-blue-50/70 p-6 shadow-lg md:p-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-4">
                        <Skeleton className="h-6 w-32 rounded-full" />
                        <Skeleton className="h-14 w-full max-w-xl" />
                        <Skeleton className="h-6 w-full max-w-2xl" />
                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-20 w-28 rounded-2xl" />
                            <Skeleton className="h-20 w-28 rounded-2xl" />
                            <Skeleton className="h-20 w-28 rounded-2xl" />
                        </div>
                    </div>
                    <Skeleton className="h-44 w-full max-w-xl rounded-3xl" />
                </div>
            </div>

            <div className="mb-6 flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-8 w-24 rounded-full" />
            </div>

            <Skeleton className="mb-8 h-px w-full" />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-3xl border border-border/60 bg-white p-4 space-y-3 shadow-sm">
                        <Skeleton className="h-56 w-full rounded-2xl" />
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Skeleton className="h-10 w-full rounded-full" />
                            <Skeleton className="h-10 w-full rounded-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
