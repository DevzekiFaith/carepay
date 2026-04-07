import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";
import Logo from "@/app/components/Logo";
import PaymentTable from "./PaymentTable";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  
  const { data: payments } = await supabase
    .from('payment_verifications')
    .select('*')
    .order('created_at', { ascending: false });

  const pendingCount = payments?.filter(p => p.status === 'pending').length ?? 0;

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <Logo size="md" />
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck size={16} className="text-brand-primary" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary">Admin Control</p>
               </div>
               <h1 className="text-3xl font-heading font-extrabold text-gradient-primary">Payment Verifications</h1>
            </div>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Reviewing {pendingCount} pending transfer{pendingCount !== 1 ? 's' : ''}</p>
        </header>

        <PaymentTable initialPayments={payments ?? []} />
      </div>
    </div>
  );
}
