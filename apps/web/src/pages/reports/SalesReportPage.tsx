import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { reportsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Package,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from 'recharts';

export default function SalesReportPage() {
    const { currentOutletId } = useAuthStore();
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [period, setPeriod] = useState('week');

    const { data } = useQuery({
        queryKey: ['sales-report', currentOutletId, dateFrom, dateTo],
        queryFn: () => reportsApi.getSales(currentOutletId!),
        enabled: !!currentOutletId,
    });

    const summary = data?.data?.summary || {};

    const stats = [
        {
            name: 'Gross Sales',
            value: formatCurrency(summary.totalSales || 0),
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'bg-green-500',
        },
        {
            name: 'Net Sales',
            value: formatCurrency((summary.totalSales || 0) - (summary.totalDiscount || 0)),
            change: '+8.3%',
            trend: 'up',
            icon: TrendingUp,
            color: 'bg-blue-500',
        },
        {
            name: 'Total Transaksi',
            value: summary.totalTransactions || 0,
            change: '+15.2%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'bg-purple-500',
        },
        {
            name: 'Rata-rata Transaksi',
            value: formatCurrency(summary.totalTransactions ? (summary.totalSales || 0) / summary.totalTransactions : 0),
            change: '-2.1%',
            trend: 'down',
            icon: Package,
            color: 'bg-amber-500',
        },
    ];

    // Sample chart data
    const dailySalesData = [
        { date: 'Sen', sales: 1500000, transactions: 45 },
        { date: 'Sel', sales: 2200000, transactions: 58 },
        { date: 'Rab', sales: 1800000, transactions: 42 },
        { date: 'Kam', sales: 2500000, transactions: 65 },
        { date: 'Jum', sales: 3000000, transactions: 78 },
        { date: 'Sab', sales: 2800000, transactions: 72 },
        { date: 'Min', sales: 2000000, transactions: 52 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                    <p className="text-gray-500">Analisis performa penjualan outlet Anda</p>
                </div>
                <button className="btn-primary">
                    <Download className="h-4 w-4" />
                    Export Report
                </button>
            </div>

            {/* Filter Section */}
            <div className="card p-4">
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="label">Periode</label>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="input"
                        >
                            <option value="today">Hari Ini</option>
                            <option value="week">Minggu Ini</option>
                            <option value="month">Bulan Ini</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    {period === 'custom' && (
                        <>
                            <div>
                                <label className="label">Dari</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="input pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Sampai</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="input pl-10"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <button className="btn-secondary">Terapkan Filter</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="card p-5">
                        <div className="flex items-center justify-between">
                            <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                            <span className={`text-sm font-medium flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {stat.trend === 'up' ?
                                    <TrendingUp className="h-4 w-4" /> :
                                    <TrendingDown className="h-4 w-4" />
                                }
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

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Sales Chart */}
                <div className="card p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Daily Gross Sales</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailySalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v / 1000000}jt`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10B981', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transactions Chart */}
                <div className="card p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Daily Transactions</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailySalesData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="transactions" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products Table */}
            <div className="card overflow-hidden">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Produk Terlaris</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Rank
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Produk
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Qty Terjual
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Revenue
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data?.data?.topProducts?.slice(0, 5).map((product: any, index: number) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium ${index === 0 ? 'bg-amber-100 text-amber-700' :
                                                index === 1 ? 'bg-gray-100 text-gray-700' :
                                                    index === 2 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-gray-50 text-gray-500'
                                            }`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{product.quantity}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(product.revenue)}</td>
                                </tr>
                            )) || (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                            Belum ada data penjualan
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
