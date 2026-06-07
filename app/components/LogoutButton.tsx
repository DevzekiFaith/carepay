"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      const toastId = toast.loading("Logging out...");
      
      // Perform signOut via Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Logged out", { id: toastId });

      // Using window.location.href is the most reliable way to 
      // ensure all client-side state, caches, and memory are cleared.
      window.location.href = "/";
      
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback: force redirect to home anyway
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] uppercase tracking-widest font-bold text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
      title="Logout"
    >
      <LogOut size={14} />
      <span>Logout</span>
    </button>
  );
}
