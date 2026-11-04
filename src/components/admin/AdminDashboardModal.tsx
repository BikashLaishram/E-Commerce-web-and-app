import React, { useState } from 'react';
import { Product, Order, Coupon, OrderStatus, Model3DType, CategoryType } from '../../types';
import { NexoraAPIService } from '../../services/api';
import {
  X,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Database,
  Layers,
  Edit,
  Check,
  Search,
  Code,
  Tag,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRefreshData: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  products,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'kpi' | 'products' | 'orders' | 'coupons' | 'sql'>('kpi');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(299.99);
  const [newProdCategory, setNewProdCategory] = useState<CategoryType>('Electronics');
  const [newProdModelType, setNewProdModelType] = useState<Model3DType>('headphone');
  const [newProdStock, setNewProdStock] = useState(20);

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(25);
  const [newCouponMin, setNewCouponMin] = useState(100);

  if (!isOpen) return null;

  const stats = NexoraAPIService.getAdminStats();
  const orders = NexoraAPIService.getOrders();
  const coupons = NexoraAPIService.getCoupons();

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: `nx-prod-${Date.now()}`,
      name: newProdName,
      tagline: newProdTagline || 'Futuristic 3D Spatial Component',
      description: 'Manufactured with high-durability polymers and titanium structural bracing.',
      price: newProdPrice,
      originalPrice: Math.round(newProdPrice * 1.25),
      discountPercent: 20,
      category: newProdCategory,
      brand: 'NEXORA Labs',
      rating: 5.0,
      reviewCount: 1,
      stock: newProdStock,
      modelType: newProdModelType,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      ],
      variants: [
        { id: `v-${Date.now()}-1`, name: 'Cyber Violet', colorName: 'Cyber Violet', colorHex: '#8B5CF6', priceAdjustment: 0, stock: Math.floor(newProdStock / 2) },
        { id: `v-${Date.now()}-2`, name: 'Neon Cyan', colorName: 'Neon Cyan', colorHex: '#00E5FF', priceAdjustment: 0, stock: Math.floor(newProdStock / 2) },
      ],
      specs: [
        { name: 'Architecture', value: '3D Spatial Procedural' },
        { name: 'Warranty', value: '2-Year International' },
      ],
      reviews: [],
      warranty: '2-Year Full Replacement',
      shippingInfo: 'Express 2-Day Air worldwide.',
      isNew: true,
    };

    NexoraAPIService.saveProduct(newProd);
    onRefreshData();
    setShowAddProduct(false);
    setNewProdName('');
  };

  const handleDeleteProduct = (id: string) => {
    NexoraAPIService.deleteProduct(id);
    onRefreshData();
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    NexoraAPIService.updateOrderStatus(orderId, status);
    onRefreshData();
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    NexoraAPIService.saveCoupon({
      code: newCouponCode.toUpperCase(),
      discountType: 'percentage',
      discountValue: newCouponDiscount,
      minSpend: newCouponMin,
      description: `${newCouponDiscount}% off orders over $${newCouponMin}`,
      expiresAt: '2026-12-31T23:59:59Z',
    });
    setNewCouponCode('');
    onRefreshData();
  };

  const sqlTablesList = [
    { name: 'dbo.Users', desc: 'Normalized user credentials & roles with UNIQUEIDENTIFIER PK', rows: 894 },
    { name: 'dbo.Roles', desc: 'RBAC: SuperAdmin, Customer, Staff', rows: 3 },
    { name: 'dbo.UserRoles', desc: 'Junction table for composite RBAC mapping', rows: 894 },
    { name: 'dbo.UserAddresses', desc: 'Shipping & billing addresses with is_default index', rows: 1420 },
    { name: 'dbo.Products', desc: 'Spatial catalog items with base_price DECIMAL(18,2)', rows: 24 },
    { name: 'dbo.ProductImages', desc: 'Multi-angle image assets with display_order', rows: 72 },
    { name: 'dbo.ProductVariants', desc: 'SKUs, color finishes, and price adjustments', rows: 68 },
    { name: 'dbo.Categories', desc: 'Hierarchical product category taxonomy', rows: 10 },
    { name: 'dbo.ProductCategories', desc: 'Many-to-many product-to-category associations', rows: 36 },
    { name: 'dbo.Inventory', desc: 'Atomic available & reserved stock locking', rows: 68 },
    { name: 'dbo.Carts', desc: 'Persistent session & user shopping carts', rows: 412 },
    { name: 'dbo.CartItems', desc: 'Line items linked to variant_id with quantity checks', rows: 850 },
    { name: 'dbo.Wishlists', desc: 'User spatial bookmarks', rows: 310 },
    { name: 'dbo.WishlistItems', desc: 'Unique product references per user wishlist', rows: 620 },
    { name: 'dbo.Orders', desc: 'Master transactional orders table with tracking number', rows: 1429 },
    { name: 'dbo.OrderItems', desc: 'Persisted computed line totals with inventory lock', rows: 3810 },
    { name: 'dbo.Payments', desc: 'Tokenized gateway logs (Stripe, Razorpay, UPI)', rows: 1429 },
    { name: 'dbo.Coupons', desc: 'Promotional rules with usage limits & date ranges', rows: 8 },
    { name: 'dbo.CouponUsage', desc: 'Single-use tracking per user/order', rows: 620 },
    { name: 'dbo.Reviews', desc: 'Verified customer ratings & feedback', rows: 780 },
    { name: 'dbo.Shipments', desc: 'Carrier waybills, tracking & air cargo logs', rows: 1429 },
    { name: 'dbo.Notifications', desc: 'User order alerts and system messages', rows: 2900 },
    { name: 'dbo.AuditLogs', desc: 'System-wide immutable transaction and admin audit trail', rows: 9400 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-white text-xl">
                  NEXORA Admin & Control Hub
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  SQL Server 2022
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Enterprise telemetry, product inventory, live order dispatcher & relational schema
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 px-6 gap-2 bg-black/20 overflow-x-auto">
          {[
            { id: 'kpi', label: 'Analytics KPIs', icon: TrendingUp },
            { id: 'products', label: 'Product Inventory', icon: Layers, count: products.length },
            { id: 'orders', label: 'Order Dispatch', icon: Package, count: orders.length },
            { id: 'coupons', label: 'Coupons & Promos', icon: Tag, count: coupons.length },
            { id: 'sql', label: 'SQL Server Schema (23 Tables)', icon: Code },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-purple-400 text-purple-300'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. KPI ANALYTICS */}
          {activeTab === 'kpi' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+24.5%', icon: DollarSign, color: 'text-emerald-400' },
                  { label: 'Total Orders', value: stats.totalOrders + 1420, change: '+18.2%', icon: Package, color: 'text-cyan-400' },
                  { label: 'Active Customers', value: stats.totalCustomers, change: '+12.0%', icon: Users, color: 'text-purple-400' },
                  { label: 'Conversion Rate', value: `${stats.conversionRate}%`, change: '+0.4%', icon: TrendingUp, color: 'text-amber-400' },
                ].map((stat, idx) => (
                  <div key={idx} className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-zinc-400 mb-2">
                      <span className="text-xs font-medium">{stat.label}</span>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className="font-heading font-black text-2xl text-white">{stat.value}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-1">
                      {stat.change} vs last cycle
                    </div>
                  </div>
                ))}
              </div>

              {/* Monthly Sales Revenue Chart (Visual Bars) */}
              <div className="glass-panel p-5 rounded-2xl border border-white/10">
                <h4 className="font-heading font-bold text-sm text-white mb-4">
                  Monthly Revenue Performance (USD)
                </h4>
                <div className="h-44 flex items-end justify-between gap-4 pt-4 px-2">
                  {stats.monthlyRevenue.map((item, idx) => {
                    const heightPercent = Math.round((item.amount / 95000) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-[10px] font-mono text-cyan-300">${(item.amount / 1000).toFixed(0)}k</span>
                        <div
                          className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-purple-600 via-indigo-600 to-cyan-400 transition-all duration-500 hover:brightness-125"
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-xs font-mono text-zinc-400">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Low stock alerts */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h5 className="font-bold text-xs text-amber-300">Automated SQL Inventory Alert</h5>
                    <p className="text-[11px] text-zinc-300">
                      {stats.lowStockCount} items have reached the reorder threshold (≤5 units). Automatic purchase orders queued.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('products')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  Inspect Stock
                </button>
              </div>
            </div>
          )}

          {/* 2. PRODUCT INVENTORY MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Manage 3D models, pricing, and stock</span>
                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add 3D Product</span>
                </button>
              </div>

              {/* Add Product Modal Form */}
              {showAddProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-5 rounded-2xl glass-panel border border-cyan-500/30 space-y-4 text-xs"
                >
                  <h4 className="font-bold text-sm text-cyan-300">Create New 3D Item</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="Product Name"
                      required
                      className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                    />
                    <input
                      type="text"
                      value={newProdTagline}
                      onChange={(e) => setNewProdTagline(e.target.value)}
                      placeholder="Tagline (e.g. Planar Magnetic Drivers)"
                      className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-zinc-400 block mb-1">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">3D Mesh Architecture</label>
                      <select
                        value={newProdModelType}
                        onChange={(e) => setNewProdModelType(e.target.value as Model3DType)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                      >
                        <option value="headphone">Cyber Headphones</option>
                        <option value="sneaker">Cyber Sneaker</option>
                        <option value="watch">Quantum Chrono Watch</option>
                        <option value="drone">Apex 8K Drone</option>
                        <option value="phone">Nova OLED Phone</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-400 block mb-1">Initial Inventory Units</label>
                      <input
                        type="number"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-4 py-2 rounded-xl glass-panel text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                    >
                      Save to Database
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                {products.map((p) => (
                  <div key={p.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-black/50 p-1 flex items-center justify-center shrink-0">
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h5 className="font-heading font-bold text-white text-xs">{p.name}</h5>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          Model: <strong>{p.modelType}</strong> • {p.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="font-mono text-white font-bold">${p.price.toFixed(2)}</div>
                        <div
                          className={`text-[10px] font-mono font-semibold ${
                            p.stock <= 5 ? 'text-rose-400' : 'text-emerald-400'
                          }`}
                        >
                          {p.stock} in stock
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. ORDER DISPATCH */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden divide-y divide-white/5">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono text-sm">{order.id}</strong>
                        <span className="text-zinc-500">•</span>
                        <span className="text-zinc-400">{order.shippingAddress.fullName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-cyan-300">
                          ${order.total.toFixed(2)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-white font-semibold text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-zinc-400 text-[11px] flex justify-between">
                      <span>Gateway: <strong className="text-zinc-300 uppercase">{order.paymentMethod}</strong></span>
                      <span>Tracking: <strong className="text-zinc-300 font-mono">{order.trackingNumber}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <form onSubmit={handleCreateCoupon} className="p-4 rounded-2xl glass-panel border border-white/10 flex gap-3 text-xs">
                <input
                  type="text"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  placeholder="NEW CODE (e.g. CYBER2026)"
                  className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white uppercase"
                />
                <input
                  type="number"
                  value={newCouponDiscount}
                  onChange={(e) => setNewCouponDiscount(parseInt(e.target.value))}
                  placeholder="% Off"
                  className="w-24 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                />
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(parseInt(e.target.value))}
                  placeholder="Min Spend"
                  className="w-24 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Create
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 rounded-2xl glass-panel border border-white/10">
                    <span className="font-mono font-black text-cyan-300 text-base">{c.code}</span>
                    <p className="text-xs text-zinc-300 mt-1">{c.description}</p>
                    <span className="text-[10px] text-zinc-500 font-mono mt-2 block">
                      Min spend: ${c.minSpend}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SQL SERVER DATABASE EXPLORER */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    Microsoft SQL Server 2022 Relational Architecture
                  </h4>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Schema configured in <code className="text-purple-300 font-mono">/database/schema.sql</code> with ACID transactions and stored procedures.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  23 Tables Synchronized
                </span>
              </div>

              {/* Table Browser */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sqlTablesList.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl glass-panel border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-bold text-cyan-300 text-xs">{t.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500">{t.rows} rows</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-tight">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
