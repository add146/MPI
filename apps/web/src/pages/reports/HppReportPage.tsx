import { useState } from 'react';
import { Download, Search, FlaskConical, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function HppReportPage() {
    const [search, setSearch] = useState('');
    const [period, setPeriod] = useState('month');

    // Sample HPP data
    const products = [
        {
            name: 'Roti Tawar',
            sku: 'RTW-001',
            ingredients: [
                { name: 'Tepung Terigu', qty: 0.5, unit: 'kg', price: 8000 },
                { name: 'Gula Pasir', qty: 0.05, unit: 'kg', price: 750 },
                { name: 'Mentega', qty: 0.1, unit: 'kg', price: 4000 },
            ],
            hpp: 12750,
            sellingPrice: 18000,
            margin: 29.2,
            qtySold: 150,
            totalHpp: 1912500,
            totalRevenue: 2700000,
            grossProfit: 787500,
        },
        {
            name: 'Kopi Susu Aren',
            sku: 'KSA-001',
            ingredients: [
                { name: 'Kopi Arabica', qty: 0.02, unit: 'kg', price: 5000 },
                { name: 'Susu Segar', qty: 0.15, unit: 'liter', price: 3000 },
                { name: 'Gula Aren', qty: 0.03, unit: 'kg', price: 1500 },
            ],
            hpp: 9500,
            sellingPrice: 18000,
            margin: 47.2,
            qtySold: 220,
            totalHpp: 2090000,
            totalRevenue: 3960000,
            grossProfit: 1870000,
        },
    ];

    const totalHpp = products.reduce((sum, p) => sum + p.totalHpp, 0);
    const totalRevenue = products.reduce((sum, p) => sum + p.totalRevenue, 0);
    const totalGrossProfit = products.reduce((sum, p) => sum + p.grossProfit, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan HPP</h1>
                    <p className="text-gray-500">Analisis Harga Pokok Produksi per produk</p>
                </div>
                <button className="btn-primary">
                    <Download className="h-4 w-4" />
                    Export
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <Calculator className="h-5 w-5 text-amber-500" />
                        <span className="text-sm text-gray-500">Total HPP</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalHpp)}</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <Calculator className="h-5 w-5 text-blue-500" />
                        <span className="text-sm text-gray-500">Total Pendapatan</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <Calculator className="h-5 w-5 text-green-500" />
                        <span className="text-sm text-gray-500">Laba Kotor</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalGrossProfit)}</p>
                </div>
            </div>

            {/* Filter */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        className="input w-auto"
                    >
                        <option value="day">Hari Ini</option>
                        <option value="week">Minggu Ini</option>
                        <option value="month">Bulan Ini</option>
                    </select>
                </div>
            </div>

            {/* HPP Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Produk
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                HPP per Unit
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Harga Jual
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Margin
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Qty Terjual
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Total HPP
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Laba Kotor
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.sku} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <FlaskConical className="h-4 w-4 text-primary-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-sm text-gray-500">{product.sku}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(product.hpp)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(product.sellingPrice)}</td>
                                <td className="px-4 py-3">
                                    <span className={`badge ${product.margin > 30 ? 'badge-success' : 'badge-warning'}`}>
                                        {product.margin}%
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{product.qtySold}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(product.totalHpp)}</td>
                                <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(product.grossProfit)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan={5} className="px-4 py-3 font-medium text-gray-900">Total</td>
                            <td className="px-4 py-3 font-bold text-gray-900">{formatCurrency(totalHpp)}</td>
                            <td className="px-4 py-3 font-bold text-green-600">{formatCurrency(totalGrossProfit)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
