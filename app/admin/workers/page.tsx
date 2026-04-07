import { createClient } from "@/lib/supabase/server";
import WorkerTable from "./WorkerTable";

export default async function AdminWorkersPage() {
  const supabase = await createClient();
  
  const { data: workers } = await supabase
    .from("professionals")
    .select("id, full_name, phone, primary_skill, nin, is_verified, ai_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Admin</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Workers</h1>
        <p className="mt-1 text-sm text-zinc-500">Review and verify professional registrations.</p>
      </div>

      <div className="glass-panel overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[1.5fr_auto_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 bg-white/5 backdrop-blur-sm">
          {["Name & Skill", "Phone", "NIN", "AI Check", "Status", "Action"].map((h) => (
            <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{h}</span>
          ))}
        </div>

        <WorkerTable initialWorkers={workers ?? []} />
      </div>
    </div>
  );
}
