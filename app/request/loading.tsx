import Skeleton from "../components/Skeleton";

export default function RequestLoading() {
    return (
        <div className="min-h-screen vibe-bg px-4 py-8 antialiased">
            <div className="mx-auto max-w-3xl">
                <header className="mb-8 text-center">
                    <Skeleton className="h-4 w-32 mx-auto mb-3" />
                    <Skeleton className="h-10 w-64 mx-auto mb-2" />
                    <Skeleton className="h-4 w-80 mx-auto" />
                </header>

                <main className="card-vibe rounded-2xl p-6 sm:p-10 bg-white/50">
                    <div className="space-y-8">
                        <div className="grid gap-6 sm:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-12 w-full rounded-xl" />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-4">
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-12 w-48 rounded-full" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
