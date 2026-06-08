import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export default async function AdminStoreOrdersPage() {
  const supabase = await createClient();
  
  const { data: orders, error } = await supabase
    .from("store_orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-500">Error loading orders: {error.message}</p>
      </div>
    );
  }

  async function updateOrderStatus(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const orderId = formData.get("orderId") as string;
    const newStatus = formData.get("status") as string;
    
    const { error } = await supabase
      .from("store_orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    
    if (!error) {
      revalidatePath("/admin/store-orders");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Store Management</p>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-foreground">Store Orders</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage all store orders and payments. Orders start as "Pending Payment" until you verify bank transfer.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Recent Orders</h2>
            <span className="text-xs font-bold text-zinc-500">{orders?.length || 0} orders</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Order Ref</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Actions</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders && orders.length > 0 ? (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-foreground">{order.order_ref}</td>
                    <td className="px-6 py-4 text-sm text-zinc-400">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-primary">₦{order.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        order.status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30'
                          : order.status === 'delivered'
                          ? 'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                          : 'bg-orange-500/10 text-orange-500 border border-orange-500/30'
                      }`}>
                        {order.status?.replace('_', ' ') || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <form action={updateOrderStatus} className="flex gap-2">
                        <input type="hidden" name="orderId" value={order.id} />
                        <select 
                          name="status" 
                          className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 text-foreground outline-none focus:border-brand-primary"
                        >
                          <option value="pending_payment" selected={order.status === 'pending_payment'}>Pending Payment</option>
                          <option value="paid" selected={order.status === 'paid'}>Paid</option>
                          <option value="shipped" selected={order.status === 'shipped'}>Shipped</option>
                          <option value="delivered" selected={order.status === 'delivered'}>Delivered</option>
                          <option value="cancelled" selected={order.status === 'cancelled'}>Cancelled</option>
                        </select>
                        <button 
                          type="submit"
                          className="text-xs bg-brand-primary text-background px-3 py-1 rounded font-bold hover:bg-brand-primary/90 transition-colors"
                        >
                          Update
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
