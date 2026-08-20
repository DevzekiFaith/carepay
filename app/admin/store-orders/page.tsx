import { createClient } from "@/lib/supabase/server";
import StoreOrdersTable from "./StoreOrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminStoreOrdersPage() {
  const supabase = await createClient();
  
  const { data: orders, error } = await supabase
    .from("store_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Store Management</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Store Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage all store orders, customer delivery items, and instant status transitions.
        </p>
      </div>

      <StoreOrdersTable initialOrders={orders ?? []} />
    </div>
  );
}

