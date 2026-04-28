"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Force a full page reload to clear all states and redirect
      window.location.href = '/';
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = '/';
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
