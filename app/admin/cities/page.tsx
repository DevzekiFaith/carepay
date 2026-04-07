import { CITIES } from "@/lib/cities";
import CityList from "./CityList";

export default function AdminCitiesPage() {
  const liveCount = CITIES.filter((c) => c.active).length;
  const soonCount = CITIES.filter((c) => c.launchSoon).length;
  const totalAreas = CITIES.reduce((sum, c) => sum + c.areas.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Admin</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">City Management</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Configure which cities and areas are active. Edit{" "}
          <code className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[11px] font-mono">lib/cities.ts</code>{" "}
          to add new cities permanently.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Live Cities", value: liveCount, color: "text-emerald-500" },
          { label: "Coming Soon", value: soonCount, color: "text-amber-500" },
          { label: "Total Areas", value: totalAreas, color: "text-brand-primary" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-panel p-4 text-center">
            <p className={`text-2xl font-heading font-extrabold ${color}`}>{value}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <CityList cities={CITIES} />
    </div>
  );
}
