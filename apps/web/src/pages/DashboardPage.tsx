import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { reportsApi, transactionsApi, rawMaterialsApi } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    Users,
    ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    const { currentOutletId } = useAuthStore();

    // Fetch sales summary
    const { data: salesData } = useQuery({
        queryKey: ['sales-summary', currentOutletId],
        queryFn: () => reportsApi.getSales(currentOutletId!),
        enabled: !!currentOutletId,
    });

    // Fetch P&L
    const { data: plData } = useQuery({
        queryKey: ['profit-loss', currentOutletId],
        queryFn: () => reportsApi.getProfitLoss(currentOutletId!),
        enabled: !!currentOutletId,
    });

    // Fetch low stock alerts
    const { data: lowStockData } = useQuery({
        queryKey: ['low-stock', currentOutletId],
        queryFn: () => rawMaterialsApi.getLowStock(currentOutletId!),
        enabled: !!currentOutletId,
    });

    // Fetch balance sheet for inventory
    const { data: balanceData } = useQuery({
        queryKey: ['balance-sheet', currentOutletId],
        queryFn: () => reportsApi.getBalanceSheet(currentOutletId!),
        enabled: !!currentOutletId,
    });

    const stats = [
        {
            name: 'Total Penjualan',
            value: formatCurrency(salesData?.data?.summary?.totalSales || 0),
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-500',
        },
        {
            name: 'Laba Bersih',
            value: formatCurrency(plData?.data?.netProfit || 0),
            change: '+8.2%',
            trend: 'up',
            icon: TrendingUp,
            color: 'bg-blue-500',
        },
        {
            name: 'Stok Menipis',
            value: `${lowStockData?.data?.length || 0} Item`,
            change: 'Perhatian',
            trend: 'warning',
            icon: AlertTriangle,
            color: 'bg-amber-500',
        },
        {
            name: 'Total Transaksi',
            value: formatNumber(salesData?.data?.summary?.totalTransactions || 0),
            change: '+4.1%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'bg-purple-500',
        },
    ];

    const inventoryData = [
        { name: 'Bahan Baku', value: balanceData?.data?.assets?.inventory?.rawMaterials || 0 },
        { name: 'Produk Jadi', value: balanceData?.data?.assets?.inventory?.finishedGoods || 0 },
    ];

    const COLORS = ['#10B981', '#3B82F6'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Selamat datang! Berikut ringkasan bisnis Anda hari ini.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="card p-5">
                        <div className="flex items-center justify-between">
                            <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' :
                                    stat.trend === 'down' ? 'text-red-600' :
                                        'text-amber-600'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm text-gray-500">{stat.name}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Grafik Penjualan</h3>
                        <span className="text-sm text-gray-500">7 hari terakhir</span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[
                                { day: 'Sen', value: 1500000 },
                                { day: 'Sel', value: 2200000 },
                                { day: 'Rab', value: 1800000 },
                                { day: 'Kam', value: 2500000 },
                                { day: 'Jum', value: 3000000 },
                                { day: 'Sab', value: 2800000 },
                                { day: 'Min', value: 2000000 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000000}jt`} />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Inventory Pie Chart */}
                <div className="card p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Nilai Inventory</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={inventoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {inventoryData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {inventoryData.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: COLORS[index] }} />
                                <span className="text-sm text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(balanceData?.data?.assets?.inventory?.total || 0)}
                        </p>
                        <p className="text-sm text-gray-500">Total Nilai</p>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alert */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Peringatan Stok Menipis
                        </h3>
                        <Link to="/catalog/raw-materials" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Lihat Semua <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {lowStockData?.data?.slice(0, 5).map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">SKU: {item.sku || '-'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-red-600">{item.stockQty} {item.unit}</p>
                                    <p className="text-sm text-gray-500">Min: {item.minStock}</p>
                                </div>
                            </div>
                        )) || (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Tidak ada stok yang menipis
                                </p>
                            )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Produk Terlaris</h3>
                        <Link to="/reports" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                            Lihat Laporan <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {salesData?.data?.topProducts?.slice(0, 5).map((product: any, index: number) => (
                            <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-3">
                                    <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-50 text-gray-500'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                                    <p className="text-sm text-gray-500">{product.quantity} terjual</p>
                                </div>
                            </div>
                        )) || (
                                <p className="text-sm text-gray-500 text-center py-4">
                                    Belum ada data penjualan
                                </p>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
