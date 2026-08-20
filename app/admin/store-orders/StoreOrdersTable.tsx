"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Search, Filter, RotateCcw, AlertCircle, ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock } from "lucide-react";

export type StoreOrder = {
  id: string;
  order_ref: string;
  customer_name: string;
  total: number;
  status: string;
  items: any;
  delivery_address?: string;
  notes?: string;
  created_at: string;
};

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: any }> = {
  pending_payment: {
    label: "Pending Payment",
    cls: "border-amber-500/40 bg-amber-500/15 text-amber-400",
    icon: Clock,
  },
  processing: {
    label: "Processing (Paid)",
    cls: "border-emerald-500/40 bg-emerald-500/15 text-emerald-400",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    cls: "border-blue-500/40 bg-blue-500/15 text-blue-400",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    cls: "border-purple-500/40 bg-purple-500/15 text-purple-400",
    icon: Package,
  },
  cancelled: {
    label: "Cancelled",
    cls: "border-rose-500/40 bg-rose-500/15 text-rose-400",
    icon: XCircle,
  },
};

export default function StoreOrdersTable({ initialOrders }: { initialOrders: StoreOrder[] }) {
  const [orders, setOrders] = useState<StoreOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const { error } = await supabase
        .from("store_orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) {
        toast.error("Failed to update order status: " + error.message);
        return;
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(`Order status updated to ${newStatus.replace("_", " ").toUpperCase()}`);
    } catch (err: any) {
      toast.error("Update error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "processing" && order.status !== "processing" && order.status !== "paid") {
          return false;
        } else if (statusFilter !== "processing" && order.status !== statusFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesRef = (order.order_ref || "").toLowerCase().includes(q);
        const matchesCustomer = (order.customer_name || "").toLowerCase().includes(q);
        const matchesAddr = (order.delivery_address || "").toLowerCase().includes(q);
        const matchesNotes = (order.notes || "").toLowerCase().includes(q);
        let matchesItems = false;
        if (Array.isArray(order.items)) {
          matchesItems = order.items.some((i: any) =>
            (i.name || i.product?.name || "").toLowerCase().includes(q)
          );
        }
        if (!matchesRef && !matchesCustomer && !matchesAddr && !matchesNotes && !matchesItems) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 backdrop-blur-md flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" />
          <input
            type="text"
            placeholder="Search order ref, customer name, items, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-blue-500/20 text-xs text-foreground placeholder:text-zinc-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-blue-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-blue-500/30 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-blue-100 outline-none focus:border-blue-400 transition-colors cursor-pointer"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending_payment">
              Pending Payment ({orders.filter((o) => o.status === "pending_payment").length})
            </option>
            <option value="processing">
              Processing / Paid ({orders.filter((o) => o.status === "processing" || o.status === "paid").length})
            </option>
            <option value="shipped">
              Shipped ({orders.filter((o) => o.status === "shipped").length})
            </option>
            <option value="delivered">
              Delivered ({orders.filter((o) => o.status === "delivered").length})
            </option>
            <option value="cancelled">
              Cancelled ({orders.filter((o) => o.status === "cancelled").length})
            </option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(statusFilter !== "all" || searchQuery !== "") && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-bold text-blue-300 transition-colors"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      {/* Main Table */}
      <div className="glass-panel overflow-hidden border border-blue-500/20 rounded-2xl shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-blue-500/20 bg-blue-950/30 backdrop-blur-sm">
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Order Ref</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Customer & Items</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Total</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Status</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Update Status</th>
                <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <AlertCircle size={24} />
                      </div>
                      <p className="text-sm font-semibold text-zinc-300">No matching orders found</p>
                      <p className="text-xs text-zinc-500">Try changing your search keyword or status filter.</p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-500 transition-colors"
                      >
                        <RotateCcw size={13} /> Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending_payment;
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-blue-600/[0.03] transition-colors">
                      {/* Order Ref */}
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-blue-400">
                          {order.order_ref}
                        </span>
                      </td>

                      {/* Customer & Items */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-foreground">{order.customer_name}</p>
                        <div className="text-xs text-zinc-400 mt-1 max-w-sm">
                          {order.order_ref.startsWith("INSP-") ? (
                            <div>
                              <span className="text-zinc-300">📍 {order.delivery_address || "Location requested"}</span>
                              {order.notes && <p className="text-[11px] text-zinc-500 mt-0.5">📅 {order.notes}</p>}
                            </div>
                          ) : Array.isArray(order.items) && order.items.length > 0 ? (
                            <div className="space-y-0.5">
                              {order.items.map((it: any, idx: number) => (
                                <span key={idx} className="inline-block bg-slate-900/60 rounded px-1.5 py-0.5 text-[11px] text-zinc-300 mr-1.5 mb-1">
                                  {it.quantity}x {it.name || it.product?.name || "Item"}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-zinc-500">Store Order Item</span>
                          )}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 text-sm font-extrabold text-brand-primary whitespace-nowrap">
                        ₦{(order.total ?? 0).toLocaleString()}
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${cfg.cls}`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Update Status Dropdown */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          disabled={isUpdating}
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="text-xs font-semibold bg-slate-900 border border-blue-500/30 rounded-xl px-3 py-1.5 text-blue-200 outline-none focus:border-blue-400 cursor-pointer shadow-sm disabled:opacity-50 transition-colors"
                        >
                          <option value="pending_payment" className="bg-slate-900 text-amber-400">Pending Payment</option>
                          <option value="processing" className="bg-slate-900 text-emerald-400">Processing (Paid)</option>
                          <option value="shipped" className="bg-slate-900 text-blue-400">Shipped</option>
                          <option value="delivered" className="bg-slate-900 text-purple-400">Delivered</option>
                          <option value="cancelled" className="bg-slate-900 text-rose-400">Cancelled</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-xs text-zinc-400 whitespace-nowrap">
                        {new Date(order.created_at).toLocaleDateString("en-NG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 border-t border-blue-500/20 bg-blue-950/20 backdrop-blur-sm flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-zinc-400">
          <div>
            Showing <span className="text-blue-400 font-extrabold">{filtered.length}</span> of {orders.length} orders
          </div>
          <div className="flex gap-4">
            <span className="text-amber-400">{orders.filter((o) => o.status === "pending_payment").length} pending payment</span>
            <span className="text-emerald-400">{orders.filter((o) => o.status === "processing" || o.status === "paid").length} paid / processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
