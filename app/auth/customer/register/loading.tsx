import Skeleton from "../../../components/Skeleton";

export default function AuthLoading() {
    return (
        <div className="min-h-screen vibe-bg flex items-center justify-center p-4">
            <div className="w-full max-w-md card-vibe mac-card-pad-lg bg-white/50">
                <header className="mb-8 text-center">
                    <Skeleton className="h-8 w-48 mx-auto mb-3" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </header>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <Skeleton className="h-12 w-full rounded-full mt-4" />
                    <div className="pt-6 border-t border-stone-100 text-center">
                        <Skeleton className="h-4 w-48 mx-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}
