import Skeleton from "./components/Skeleton";

export default function RootLoading() {
    return (
        <div className="min-h-screen vibe-bg px-4 py-8 antialiased">
            <div className="mx-auto max-w-5xl">
                <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-4" />
                        <Skeleton className="h-12 w-64 mb-4" />
                        <Skeleton className="h-4 w-96 mb-8" />
                        <div className="flex gap-4">
                            <Skeleton className="h-12 w-40 rounded-full" />
                            <Skeleton className="h-12 w-48 rounded-full" />
                        </div>
                    </div>
                    <Skeleton className="hidden sm:block h-48 w-64 rounded-2xl" />
                </header>

                <main className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-8">
                        <section className="card-vibe rounded-2xl p-6 bg-white/50">
                            <Skeleton className="h-4 w-40 mb-6" />
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                {[...Array(6)].map((_, i) => (
                                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                                ))}
                            </div>
                        </section>
                        <Skeleton className="h-96 w-full rounded-2xl" />
                    </div>
                    <aside className="space-y-6">
                        <Skeleton className="h-48 w-full rounded-2xl" />
                        <Skeleton className="h-64 w-full rounded-2xl" />
                        <Skeleton className="h-32 w-full rounded-2xl" />
                    </aside>
                </main>
            </div>
        </div>
    );
}
