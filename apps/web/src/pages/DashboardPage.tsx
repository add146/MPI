import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Package, AlertTriangle, ShoppingCart, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    // Sample chart data
    const dailySales = [
        { date: 'Sen', sales: 2500000 },
        { date: 'Sel', sales: 3200000 },
        { date: 'Rab', sales: 2800000 },
        { date: 'Kam', sales: 4100000 },
        { date: 'Jum', sales: 3800000 },
        { date: 'Sab', sales: 5200000 },
        { date: 'Min', sales: 4500000 },
    ];

    const inventoryData = [
        { name: 'Produk Jadi', value: 35000000 },
        { name: 'Bahan Baku', value: 25000000 },
    ];

    const COLORS = ['#14B8A6', '#F59E0B'];

    const lowStockItems = [
        { name: 'Kopi Arabica', stock: 3, minStock: 5, unit: 'kg' },
        { name: 'Gula Pasir', stock: 8, minStock: 15, unit: 'kg' },
        { name: 'Donat Coklat', stock: 5, minStock: 10, unit: 'pcs' },
    ];

    const topProducts = [
        { name: 'Kopi Susu Aren', qty: 156, revenue: 2808000 },
        { name: 'Roti Tawar', qty: 124, revenue: 2232000 },
        { name: 'Donat Coklat', qty: 98, revenue: 784000 },
    ];

    const stats = [
        { label: 'Penjualan Hari Ini', value: formatCurrency(5200000), icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Transaksi', value: '48', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Pelanggan Baru', value: '12', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Laba Bersih', value: formatCurrency(1250000), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Ringkasan bisnis hari ini</p>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-3 sm:p-4">
                        <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs sm:text-sm text-gray-500 truncate">{stat.label}</p>
                                <p className="text-base sm:text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Sales Chart */}
                <div className="card p-4 sm:p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Penjualan Mingguan</h3>
                    <div className="h-48 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailySales}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v / 1000000}jt`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#14B8A6"
                                    strokeWidth={2}
                                    dot={{ fill: '#14B8A6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Inventory Pie Chart */}
                <div className="card p-4 sm:p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Nilai Inventory</h3>
                    <div className="h-48 sm:h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {inventoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 sm:gap-6 mt-2">
                        {inventoryData.map((item, idx) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                                <span className="text-xs sm:text-sm text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Low Stock Alert */}
                <div className="card overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <h3 className="font-semibold text-gray-900">Stok Menipis</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {lowStockItems.map((item) => (
                            <div key={item.name} className="px-4 sm:px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-500">Min: {item.minStock} {item.unit}</p>
                                </div>
                                <span className="badge badge-danger text-xs">
                                    {item.stock} {item.unit}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="card overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary-500" />
                        <h3 className="font-semibold text-gray-900">Produk Terlaris</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {topProducts.map((item, idx) => (
                            <div key={item.name} className="px-4 sm:px-5 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary-100 text-primary-600 font-bold text-xs sm:text-sm flex items-center justify-center">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">{item.qty} terjual</p>
                                    </div>
                                </div>
                                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                    {formatCurrency(item.revenue)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
