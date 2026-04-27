"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wrench, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Truck,
  Search,
  MoreVertical,
  ArrowUpRight,
  Loader2,
  Package,
  Calendar,
  ChevronRight,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/app/components/Logo";

interface Order {
  id: string;
  order_ref: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
  items: any[];
}

interface ServiceRequest {
  id: string;
  service_type: string;
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
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('store_orders')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  const stats = {
    totalRevenue: orders.reduce((acc, curr) => acc + curr.total, 0),
    activeOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    completedJobs: requests.filter(r => r.status === 'completed').length
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 border-r border-white/5 p-6 flex flex-col gap-8">
        <Logo href="/admin/dashboard" />
        
        <nav className="flex flex-col gap-2">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'orders', icon: ShoppingBag, label: 'Store Orders' },
            { id: 'requests', icon: Wrench, label: 'Service Requests' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-[0_0_20px_rgba(249,115,22,0.1)]' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-10 w-10 rounded-full bg-brand-primary flex items-center justify-center font-bold text-background shadow-premium">
              A
            </div>
            <div>
              <p className="text-xs font-bold">Admin Panel</p>
              <p className="text-[10px] text-zinc-500">Master Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-heading font-black tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-zinc-500 mt-1 uppercase tracking-[0.2em] font-bold">Management Overview</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input 
                  type="text"
                  placeholder="Search ref, name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-brand-primary/50 transition-all outline-none"
                />
              </div>
              <button 
                onClick={fetchData}
                className="h-11 w-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <Clock size={18} className="text-zinc-400" />
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
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `₦${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Active Orders', value: stats.activeOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                    { label: 'Completed Jobs', value: stats.completedJobs, icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  ].map((stat, idx) => (
                    <motion.div 
                      key={idx} 
                      variants={itemVariants}
                      className="glass-panel p-6 border border-white/5 relative overflow-hidden group"
                    >
                      <div className={`absolute top-0 right-0 p-3 ${stat.bg} ${stat.color} rounded-bl-3xl opacity-50 group-hover:opacity-100 transition-opacity`}>
                        <stat.icon size={20} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">{stat.label}</p>
                      <p className="text-2xl font-heading font-black">{stat.value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="glass-panel p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold">Recent Orders</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-brand-primary hover:text-brand-glow transition-all">View all →</button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                              <Package size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{order.customer_name}</p>
                              <p className="text-[10px] text-zinc-500 font-mono">{order.order_ref}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-brand-primary">₦{order.total.toLocaleString()}</p>
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${
                              order.status === 'delivered' ? 'text-emerald-500' : 'text-orange-500'
                            }`}>{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="glass-panel p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-lg font-bold">New Requests</h3>
                      <button onClick={() => setActiveTab('requests')} className="text-xs font-bold text-brand-primary hover:text-brand-glow transition-all">View all →</button>
                    </div>
                    <div className="space-y-4">
                      {requests.slice(0, 5).map((req) => (
                        <div key={req.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400">
                              <Wrench size={20} />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{req.service_type}</p>
                              <p className="text-[10px] text-zinc-500 truncate max-w-[150px]">{req.address}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest ${
                              req.status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>{req.status}</span>
                            <p className="text-[9px] text-zinc-600 mt-1 font-bold uppercase">{new Date(req.created_at).toLocaleDateString()}</p>
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
                className="glass-panel overflow-hidden"
              >
                <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold">All Store Orders</h3>
                    <p className="text-xs text-zinc-500 mt-1">Manage fulfillment and updates</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
                      <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-background text-xs font-bold hover:bg-brand-glow transition-all">
                      Export CSV
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Order Ref</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customer</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6 font-mono text-sm font-bold text-brand-primary">{order.order_ref}</td>
                          <td className="px-8 py-6 text-sm font-bold">{order.customer_name}</td>
                          <td className="px-8 py-6 text-sm font-extrabold">₦{order.total.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <select 
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className={`bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-brand-primary/50 transition-all ${
                                order.status === 'delivered' ? 'text-emerald-500' : 
                                order.status === 'shipped' ? 'text-blue-500' : 'text-orange-500'
                              }`}
                            >
                              <option value="pending_payment">Pending Payment</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-200 transition-all">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel overflow-hidden"
              >
                <div className="p-8 border-b border-white/5">
                  <h3 className="text-xl font-bold">Service Requests</h3>
                  <p className="text-xs text-zinc-500 mt-1">Manage pro services and assignments</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Service</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Address</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6 text-sm font-bold flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-brand-primary transition-colors">
                              <Wrench size={16} />
                            </div>
                            {req.service_type}
                          </td>
                          <td className="px-8 py-6 text-xs text-zinc-400 font-medium max-w-[200px] truncate">{req.address}</td>
                          <td className="px-8 py-6 text-xs font-mono text-zinc-500">{new Date(req.created_at).toLocaleDateString()}</td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                               req.status === 'pending' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                               req.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                               'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                             }`}>
                               {req.status}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                               Manage <ChevronRight size={12} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
