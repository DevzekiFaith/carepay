import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/cities";
import DashboardClient from "./DashboardClient";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  const [jobsRes, workersRes] = await Promise.all([
    supabase.from("service_requests").select("id, status"),
    supabase.from("professionals").select("id, is_verified"),
  ]);

  const jobs = jobsRes.data ?? [];
  const workers = workersRes.data ?? [];

  const stats = {
    totalJobs: jobs.length,
    pendingJobs: jobs.filter((j: any) => !j.status || j.status === "pending").length,
    totalWorkers: workers.length,
    verifiedWorkers: workers.filter((w: any) => w.is_verified).length,
  };

  const activeCitiesCount = CITIES.filter((c) => c.active).length;
  const upcomingCitiesCount = CITIES.filter((c) => c.launchSoon).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Overview</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Platform health across all active cities.</p>
      </div>

      <DashboardClient 
        stats={stats} 
        activeCitiesCount={activeCitiesCount} 
        upcomingCitiesCount={upcomingCitiesCount} 
      />
    </div>
  );
}
