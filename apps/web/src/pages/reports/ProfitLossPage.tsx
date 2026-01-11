import { Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProfitLossPage() {
    // Sample P&L data
    const data = {
        period: 'Januari 2024',
        revenue: {
            grossSales: 45000000,
            discounts: 2500000,
            returns: 500000,
            netSales: 42000000,
        },
        cogs: {
            rawMaterials: 15000000,
            labor: 5000000,
            overhead: 2000000,
            total: 22000000,
        },
        expenses: {
            rent: 5000000,
            utilities: 1500000,
            salaries: 8000000,
            other: 1000000,
            total: 15500000,
        },
        grossProfit: 20000000,
        netProfit: 4500000,
        profitMargin: 10.7,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Laba Rugi</h1>
                    <p className="text-gray-500">Analisis pendapatan dan pengeluaran bisnis</p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="input w-auto">
                        <option>Januari 2024</option>
                        <option>Desember 2023</option>
                        <option>November 2023</option>
                    </select>
                    <button className="btn-primary">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Penjualan Bersih</span>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.revenue.netSales)}</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Laba Kotor</span>
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.grossProfit)}</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Laba Bersih</span>
                        <span className="text-xs text-green-600 font-medium">{data.profitMargin}%</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(data.netProfit)}</p>
                </div>
            </div>

            {/* P&L Statement */}
            <div className="card overflow-hidden">
                <div className="p-5 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-900">Laporan Laba Rugi - {data.period}</h3>
                </div>
                <div className="p-5 space-y-6">
                    {/* Revenue Section */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Pendapatan</h4>
                        <div className="space-y-2 pl-4">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Penjualan Kotor</span>
                                <span className="font-medium text-gray-900">{formatCurrency(data.revenue.grossSales)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Diskon</span>
                                <span className="text-red-600">({formatCurrency(data.revenue.discounts)})</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Retur</span>
                                <span className="text-red-600">({formatCurrency(data.revenue.returns)})</span>
                            </div>
                            <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                <span className="text-gray-900">Penjualan Bersih</span>
                                <span className="text-gray-900">{formatCurrency(data.revenue.netSales)}</span>
                            </div>
                        </div>
                    </div>

                    {/* COGS Section */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Harga Pokok Penjualan (HPP)</h4>
                        <div className="space-y-2 pl-4">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Bahan Baku</span>
                                <span className="text-gray-900">{formatCurrency(data.cogs.rawMaterials)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Tenaga Kerja Langsung</span>
                                <span className="text-gray-900">{formatCurrency(data.cogs.labor)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Overhead</span>
                                <span className="text-gray-900">{formatCurrency(data.cogs.overhead)}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                <span className="text-gray-900">Total HPP</span>
                                <span className="text-red-600">({formatCurrency(data.cogs.total)})</span>
                            </div>
                        </div>
                    </div>

                    {/* Gross Profit */}
                    <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg font-semibold">
                        <span className="text-blue-900">Laba Kotor</span>
                        <span className="text-blue-900">{formatCurrency(data.grossProfit)}</span>
                    </div>

                    {/* Operating Expenses */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-3">Beban Operasional</h4>
                        <div className="space-y-2 pl-4">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Sewa</span>
                                <span className="text-gray-900">{formatCurrency(data.expenses.rent)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Utilitas</span>
                                <span className="text-gray-900">{formatCurrency(data.expenses.utilities)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Gaji Karyawan</span>
                                <span className="text-gray-900">{formatCurrency(data.expenses.salaries)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                                <span className="text-gray-600">Lain-lain</span>
                                <span className="text-gray-900">{formatCurrency(data.expenses.other)}</span>
                            </div>
                            <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                <span className="text-gray-900">Total Beban</span>
                                <span className="text-red-600">({formatCurrency(data.expenses.total)})</span>
                            </div>
                        </div>
                    </div>

                    {/* Net Profit */}
                    <div className="flex justify-between py-4 bg-green-50 px-4 rounded-lg font-bold text-lg">
                        <span className="text-green-900">Laba Bersih</span>
                        <span className="text-green-600">{formatCurrency(data.netProfit)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
