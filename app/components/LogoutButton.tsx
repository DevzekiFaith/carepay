"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
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
