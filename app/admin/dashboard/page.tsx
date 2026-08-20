"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wrench, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Search,
  MoreVertical,
  Loader2,
  Package,
  ChevronRight,
  Filter,
  RotateCcw,
  RefreshCw,
  XCircle,
  Truck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/app/components/Logo";
import { toast } from "sonner";

interface Order {
  id: string;
  order_ref: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
  items: any[];
  delivery_address?: string;
  notes?: string;
}

interface ServiceRequest {
  id: string;
  service_type: string;
  description?: string;
  address: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'requests'>('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [reqStatusFilter, setReqStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Orders
      const { data: orderData } = await supabase
        .from('store_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      // 2. Fetch Requests
      const { data: reqData } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (orderData) setOrders(orderData);
      if (reqData) setRequests(reqData);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load dashboard data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('store_orders')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        toast.error("Failed to update status: " + error.message);
        return;
      }

      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast.success(`Order updated to ${newStatus.replace('_', ' ').toUpperCase()}`);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const updateRequestStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', id);
      
      if (error) {
        toast.error("Failed to update request: " + error.message);
        return;
      }

      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      toast.success(`Service request marked as ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      toast.error("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (orderStatusFilter !== "all" && o.status !== orderStatusFilter) return false;
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase();
        const matchesRef = (o.order_ref || "").toLowerCase().includes(q);
        const matchesCust = (o.customer_name || "").toLowerCase().includes(q);
        const matchesAddr = (o.delivery_address || "").toLowerCase().includes(q);
        if (!matchesRef && !matchesCust && !matchesAddr) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, searchTerm]);

  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      if (reqStatusFilter !== "all" && r.status !== reqStatusFilter) return false;
      if (searchTerm.trim() !== "") {
        const q = searchTerm.toLowerCase();
        const matchesType = (r.service_type || "").toLowerCase().includes(q);
        const matchesAddr = (r.address || "").toLowerCase().includes(q);
        const matchesDesc = (r.description || "").toLowerCase().includes(q);
        if (!matchesType && !matchesAddr && !matchesDesc) return false;
      }
      return true;
    });
  }, [requests, reqStatusFilter, searchTerm]);

  const stats = {
    totalRevenue: orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0),
    activeOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    completedJobs: requests.filter(r => r.status === 'completed').length
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-500" size={36} />
        <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 border-r border-blue-500/20 bg-slate-950/90 p-6 flex flex-col gap-8 backdrop-blur-xl">
        <Logo href="/admin" />
        
        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'orders', icon: ShoppingBag, label: 'Store Orders' },
            { id: 'requests', icon: Wrench, label: 'Service Requests' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as 'overview' | 'orders' | 'requests')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white border border-blue-400/50 shadow-[0_4px_20px_rgba(37,99,235,0.45)]' 
                  : 'bg-blue-950/40 text-blue-200/90 hover:bg-blue-600/30 hover:text-white border border-blue-500/20'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-blue-500/20">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-950/30 border border-blue-500/20">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              A
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Admin Console</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Live Master Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header & Global Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-heading font-extrabold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest font-bold">Management & Fulfillment Control</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-400" size={15} />
                <input 
                  type="text"
                  placeholder="Search ref, customer, address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900/90 border border-blue-500/30 rounded-xl py-2 pl-10 pr-8 text-xs text-foreground placeholder:text-zinc-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all outline-none"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs">✕</button>
                )}
              </div>
              <button 
                onClick={fetchData}
                title="Refresh Data"
                className="h-9 w-9 flex items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-300 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
                    { label: 'Active Orders', value: stats.activeOrders, icon: ShoppingBag, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/30' },
                    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' },
                    { label: 'Completed Jobs', value: stats.completedJobs, icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30' },
                  ].map((stat, idx) => (
                    <motion.div 
                      key={idx} 
                      variants={itemVariants}
                      className="glass-panel p-6 border border-blue-500/20 rounded-2xl relative overflow-hidden group shadow-lg"
                    >
                      <div className={`absolute top-0 right-0 p-3.5 ${stat.bg} ${stat.color} border-b border-l rounded-bl-3xl`}>
                        <stat.icon size={18} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">{stat.label}</p>
                      <p className="text-2xl font-heading font-extrabold text-foreground">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Recent Orders</h3>
                      <button 
                        onClick={() => setActiveTab('orders')} 
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View all ({orders.length}) →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-blue-500/15 hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
                              <Package size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">{order.customer_name}</p>
                              <p className="text-[10px] text-zinc-400 font-mono">
                                {order.order_ref} {order.order_ref.startsWith("INSP-") ? "· 🔍 Inspection" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-extrabold text-brand-primary">₦{(order.total || 0).toLocaleString()}</p>
                            <span className={`text-[9px] font-extrabold uppercase tracking-widest ${
                              order.status === 'delivered' ? 'text-emerald-400' : 'text-amber-400'
                            }`}>{order.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* New Requests */}
                  <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">New Service Requests</h3>
                      <button 
                        onClick={() => setActiveTab('requests')} 
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        View all ({requests.length}) →
                      </button>
                    </div>
                    <div className="space-y-3">
                      {requests.slice(0, 5).map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-blue-500/15 hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-400">
                              <Wrench size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground">{req.service_type}</p>
                              <p className="text-[10px] text-zinc-400 truncate max-w-[160px]">{req.address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                              req.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            }`}>{req.status}</span>
                            <p className="text-[9px] text-zinc-500 mt-1 font-mono">{new Date(req.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Orders Toolbar with Working Filter */}
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Filter Status:</span>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="rounded-xl border border-blue-500/30 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-blue-100 outline-none focus:border-blue-400 cursor-pointer"
                    >
                      <option value="all">All Orders ({orders.length})</option>
                      <option value="pending_payment">Pending Payment</option>
                      <option value="processing">Processing (Paid)</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {(orderStatusFilter !== "all" || searchTerm !== "") && (
                    <button
                      onClick={() => { setOrderStatusFilter("all"); setSearchTerm(""); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-bold text-blue-300 transition-colors"
                    >
                      <RotateCcw size={12} /> Clear Filter
                    </button>
                  )}
                </div>

                {/* Orders Table */}
                <div className="glass-panel overflow-hidden border border-blue-500/20 rounded-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-blue-500/20 bg-blue-950/30 backdrop-blur-sm">
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Order Ref</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Customer</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Total</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Status</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Update Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 text-xs">
                              No orders found matching the filter criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-blue-600/[0.03] transition-colors">
                              <td className="px-6 py-4 font-mono text-xs font-bold text-blue-400">{order.order_ref}</td>
                              <td className="px-6 py-4">
                                <div className="text-xs font-bold text-foreground">{order.customer_name}</div>
                                <div className="text-[10px] text-zinc-400 mt-0.5">
                                  {order.delivery_address || (Array.isArray(order.items) ? `${order.items.length} items` : "Order")}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs font-extrabold text-brand-primary">₦{(order.total || 0).toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  order.status === 'delivered' ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' :
                                  order.status === 'shipped' ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' :
                                  order.status === 'processing' || order.status === 'paid' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' :
                                  'border-amber-500/30 bg-amber-500/10 text-amber-400'
                                }`}>
                                  {order.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select 
                                  disabled={updatingId === order.id}
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="bg-slate-900 border border-blue-500/30 rounded-xl px-2.5 py-1 text-xs font-semibold text-blue-200 outline-none focus:border-blue-400 cursor-pointer"
                                >
                                  <option value="pending_payment" className="bg-slate-900 text-amber-400">Pending Payment</option>
                                  <option value="processing" className="bg-slate-900 text-emerald-400">Processing (Paid)</option>
                                  <option value="shipped" className="bg-slate-900 text-blue-400">Shipped</option>
                                  <option value="delivered" className="bg-slate-900 text-purple-400">Delivered</option>
                                  <option value="cancelled" className="bg-slate-900 text-rose-400">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Requests Toolbar with Filter */}
                <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Filter size={14} className="text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Filter Status:</span>
                    <select
                      value={reqStatusFilter}
                      onChange={(e) => setReqStatusFilter(e.target.value)}
                      className="rounded-xl border border-blue-500/30 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-blue-100 outline-none focus:border-blue-400 cursor-pointer"
                    >
                      <option value="all">All Requests ({requests.length})</option>
                      <option value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</option>
                      <option value="matched">Matched ({requests.filter(r => r.status === 'matched').length})</option>
                      <option value="completed">Completed ({requests.filter(r => r.status === 'completed').length})</option>
                      <option value="cancelled">Cancelled ({requests.filter(r => r.status === 'cancelled').length})</option>
                    </select>
                  </div>

                  {(reqStatusFilter !== "all" || searchTerm !== "") && (
                    <button
                      onClick={() => { setReqStatusFilter("all"); setSearchTerm(""); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-xs font-bold text-blue-300 transition-colors"
                    >
                      <RotateCcw size={12} /> Clear Filter
                    </button>
                  )}
                </div>

                {/* Service Requests Table */}
                <div className="glass-panel overflow-hidden border border-blue-500/20 rounded-2xl shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-blue-500/20 bg-blue-950/30 backdrop-blur-sm">
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Service</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Address</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Date</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Status</th>
                          <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-blue-300/80">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredRequests.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 text-xs">
                              No service requests found.
                            </td>
                          </tr>
                        ) : (
                          filteredRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-blue-600/[0.03] transition-colors">
                              <td className="px-6 py-4 text-xs font-bold flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                                  <Wrench size={14} />
                                </div>
                                <span>{req.service_type}</span>
                              </td>
                              <td className="px-6 py-4 text-xs text-zinc-400 font-medium max-w-[200px] truncate">{req.address}</td>
                              <td className="px-6 py-4 text-xs font-mono text-zinc-500">{new Date(req.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                  req.status === 'pending' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 
                                  req.status === 'matched' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 
                                  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <select 
                                  disabled={updatingId === req.id}
                                  value={req.status || 'pending'}
                                  onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                                  className="bg-slate-900 border border-blue-500/30 rounded-xl px-2.5 py-1 text-xs font-semibold text-blue-200 outline-none focus:border-blue-400 cursor-pointer"
                                >
                                  <option value="pending" className="bg-slate-900 text-amber-400">Mark: Pending</option>
                                  <option value="matched" className="bg-slate-900 text-blue-400">Mark: Matched</option>
                                  <option value="completed" className="bg-slate-900 text-emerald-400">Mark: Completed</option>
                                  <option value="cancelled" className="bg-slate-900 text-rose-400">Mark: Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
