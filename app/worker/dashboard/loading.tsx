import Skeleton from "../../components/Skeleton";

export default function WorkerDashboardLoading() {
    return (
        <div className="min-h-screen vibe-bg px-4 py-8 antialiased">
            <div className="mx-auto max-w-5xl">
                <header className="mb-6 flex items-center justify-between gap-4">
                    <div className="w-full">
                        <Skeleton className="h-3 w-24 mb-3" />
                        <Skeleton className="h-8 w-56 mb-2" />
                        <Skeleton className="h-3 w-72" />
                    </div>
                    <div className="text-right shrink-0">
                        <Skeleton className="h-4 w-32 mb-2 ml-auto" />
                        <Skeleton className="h-3 w-24 mb-2 ml-auto" />
                        <Skeleton className="h-4 w-16 ml-auto rounded-full" />
                    </div>
                </header>

                <main className="mac-stack">
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full rounded-xl" />
                        ))}
                    </div>

                    <section className="card-vibe mac-card-pad bg-white/50">
                        <div className="mb-4 flex items-center justify-between">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-48" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                    <Skeleton className="h-6 w-24 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="card-vibe mac-card-pad bg-white/50">
                        <Skeleton className="h-4 w-32 mb-4" />
                        <div className="flex gap-2">
                            <Skeleton className="h-9 w-32 rounded-full" />
                            <Skeleton className="h-9 w-24 rounded-full" />
                        </div>
                    </section>

                    <Skeleton className="h-32 w-full rounded-xl" />
                </main>
            </div>
        </div>
    );
}
