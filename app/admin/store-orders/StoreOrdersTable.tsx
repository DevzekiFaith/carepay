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
    cls: "border border-amber-300 bg-amber-50 text-amber-800 font-extrabold",
    icon: Clock,
  },
  processing: {
    label: "Processing (Paid)",
    cls: "border border-emerald-300 bg-emerald-50 text-emerald-800 font-extrabold",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    cls: "border border-sky-300 bg-sky-50 text-sky-800 font-extrabold",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    cls: "border border-purple-300 bg-purple-50 text-purple-800 font-extrabold",
    icon: Package,
  },
  cancelled: {
    label: "Cancelled",
    cls: "border border-rose-300 bg-rose-50 text-rose-800 font-extrabold",
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
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-600 font-bold" />
          <input
            type="text"
            placeholder="Search order ref, customer name, items, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Status Filter */}
          <div className="flex-1 sm:flex-none min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 hover:bg-white px-3.5 py-2.5 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 transition-colors cursor-pointer shadow-xs"
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
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 transition-all shadow-xs cursor-pointer shrink-0"
            >
              <RotateCcw size={13} />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Table with Responsive Horizontal Scroll */}
      <div className="overflow-hidden border border-slate-200 rounded-2xl shadow-sm bg-white">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[760px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-900 text-white">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-white">Order Ref</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-white">Customer & Items</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-white">Total</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-white">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-white">Update Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-white">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-200">
                          <AlertCircle size={24} />
                        </div>
                        <p className="text-sm font-bold text-slate-900">No matching orders found</p>
                        <p className="text-xs text-slate-500">Try changing your search keyword or status filter.</p>
                        <button
                          onClick={resetFilters}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-md hover:bg-sky-500 transition-colors cursor-pointer"
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
                      <tr key={order.id} className="hover:bg-sky-50/50 transition-colors">
                        {/* Order Ref */}
                        <td className="px-6 py-4.5">
                          <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-1 rounded-md">
                            {order.order_ref}
                          </span>
                        </td>

                        {/* Customer & Items */}
                        <td className="px-6 py-4.5">
                          <p className="text-sm font-black text-slate-900">{order.customer_name}</p>
                          <div className="text-xs text-slate-600 mt-1 max-w-sm font-medium">
                            {order.order_ref.startsWith("INSP-") ? (
                              <div>
                                <span className="text-slate-800 font-bold">📍 {order.delivery_address || "Location requested"}</span>
                                {order.notes && <p className="text-xs text-sky-700 mt-0.5 font-semibold">📅 {order.notes}</p>}
                              </div>
                            ) : Array.isArray(order.items) && order.items.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {order.items.map((it: any, idx: number) => (
                                  <span key={idx} className="inline-block bg-slate-100 border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-700 font-semibold">
                                    {it.quantity}x {it.name || it.product?.name || "Item"}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500">Store Order Item</span>
                            )}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4.5 text-sm font-black text-sky-700 whitespace-nowrap">
                          ₦{(order.total ?? 0).toLocaleString()}
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${cfg.cls}`}>
                            {order.status.replace("_", " ")}
                          </span>
                        </td>

                        {/* Update Status Dropdown */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <select
                            disabled={isUpdating}
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 outline-none focus:border-sky-500 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
                          >
                            <option value="pending_payment" className="font-bold text-amber-700">Pending Payment</option>
                            <option value="processing" className="font-bold text-emerald-700">Processing (Paid)</option>
                            <option value="shipped" className="font-bold text-sky-700">Shipped</option>
                            <option value="delivered" className="font-bold text-purple-700">Delivered</option>
                            <option value="cancelled" className="font-bold text-rose-700">Cancelled</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold whitespace-nowrap">
                          📅 {new Date(order.created_at).toLocaleDateString("en-NG", {
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
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-black uppercase tracking-wider text-slate-700">
          <div>
            Showing <span className="text-sky-600 font-black text-sm">{filtered.length}</span> of {orders.length} orders
          </div>
          <div className="flex gap-4 flex-wrap">
            <span className="text-amber-700 font-bold">{orders.filter((o) => o.status === "pending_payment").length} pending payment</span>
            <span className="text-emerald-700 font-bold">{orders.filter((o) => o.status === "processing" || o.status === "paid").length} paid / processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}


