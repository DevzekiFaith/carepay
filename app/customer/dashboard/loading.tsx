import Skeleton from "../../components/Skeleton";

export default function CustomerDashboardLoading() {
    return (
        <div className="min-h-screen vibe-bg px-4 py-8 antialiased">
            <div className="mx-auto max-w-5xl">
                <header className="mb-6 flex items-center justify-between gap-4">
                    <div className="w-full">
                        <Skeleton className="h-3 w-20 mb-3" />
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-3 w-64" />
                    </div>
                    <div className="text-right shrink-0">
                        <Skeleton className="h-3 w-24 mb-2 ml-auto" />
                        <Skeleton className="h-3 w-20 ml-auto" />
                    </div>
                </header>

                <main className="mac-stack">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>

                    <section className="card-vibe mac-card-pad bg-white/50">
                        <Skeleton className="h-4 w-32 mb-4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-28 rounded-full" />
                            <Skeleton className="h-8 w-36 rounded-full" />
                        </div>
                    </section>

                    <section className="card-vibe mac-card-pad bg-white/50">
                        <div className="mb-6 flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-48" />
                                        <Skeleton className="h-2 w-16" />
                                    </div>
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
