import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, Package, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function BalanceSheetPage() {
    // Sample data
    const data = {
        date: '31 Januari 2024',
        assets: {
            current: {
                cash: 25000000,
                bankAccounts: 45000000,
                accountsReceivable: 8500000,
                inventory: 35000000,
                prepaidExpenses: 2500000,
                total: 116000000,
            },
            fixed: {
                equipment: 15000000,
                furniture: 8000000,
                vehicles: 35000000,
                accumulatedDepreciation: -12000000,
                total: 46000000,
            },
            totalAssets: 162000000,
        },
        liabilities: {
            current: {
                accountsPayable: 12000000,
                accruedExpenses: 3500000,
                shortTermDebt: 5000000,
                total: 20500000,
            },
            longTerm: {
                bankLoan: 25000000,
                total: 25000000,
            },
            totalLiabilities: 45500000,
        },
        equity: {
            capital: 100000000,
            retainedEarnings: 16500000,
            total: 116500000,
        },
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Neraca</h1>
                    <p className="text-sm text-gray-500">Posisi keuangan per tanggal</p>
                </div>
                <div className="action-buttons">
                    <select className="input w-auto text-sm">
                        <option>31 Januari 2024</option>
                        <option>31 Desember 2023</option>
                    </select>
                    <button className="btn-primary text-sm">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="card p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">Total Aset</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(data.assets.totalAssets)}</p>
                </div>
                <div className="card p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">Total Liabilitas</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{formatCurrency(data.liabilities.totalLiabilities)}</p>
                </div>
                <div className="card p-4 sm:p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">Total Ekuitas</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(data.equity.total)}</p>
                </div>
            </div>

            {/* Balance Sheet - Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Assets */}
                <div className="card overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 bg-green-50 flex items-center gap-2">
                        <Package className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">ASET</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        {/* Current Assets */}
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2">Aset Lancar</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Kas</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.cash)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Bank</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.bankAccounts)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Piutang</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.accountsReceivable)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Persediaan</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.inventory)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(data.assets.current.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Assets */}
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2">Aset Tetap</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Peralatan</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.fixed.equipment)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Kendaraan</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.fixed.vehicles)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Akum. Penyusutan</span>
                                    <span className="text-red-600">({formatCurrency(Math.abs(data.assets.fixed.accumulatedDepreciation))})</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(data.assets.fixed.total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between py-3 bg-green-100 px-3 rounded-lg font-bold">
                            <span className="text-green-900">TOTAL ASET</span>
                            <span className="text-green-900">{formatCurrency(data.assets.totalAssets)}</span>
                        </div>
                    </div>
                </div>

                {/* Liabilities & Equity */}
                <div className="card overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 bg-red-50 flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-red-600" />
                        <h3 className="font-semibold text-gray-900">LIABILITAS & EKUITAS</h3>
                    </div>
                    <div className="p-4 sm:p-5 space-y-4">
                        {/* Current Liabilities */}
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2">Liabilitas Jangka Pendek</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Hutang Usaha</span>
                                    <span className="text-gray-900">{formatCurrency(data.liabilities.current.accountsPayable)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Beban Akrual</span>
                                    <span className="text-gray-900">{formatCurrency(data.liabilities.current.accruedExpenses)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(data.liabilities.current.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Long-term Liabilities */}
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2">Liabilitas Jangka Panjang</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Pinjaman Bank</span>
                                    <span className="text-gray-900">{formatCurrency(data.liabilities.longTerm.bankLoan)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(data.liabilities.longTerm.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Equity */}
                        <div>
                            <h4 className="text-xs sm:text-sm font-medium text-gray-500 uppercase mb-2">Ekuitas</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Modal</span>
                                    <span className="text-gray-900">{formatCurrency(data.equity.capital)}</span>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span className="text-gray-600">Laba Ditahan</span>
                                    <span className="text-gray-900">{formatCurrency(data.equity.retainedEarnings)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(data.equity.total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between py-3 bg-blue-100 px-3 rounded-lg font-bold">
                            <span className="text-blue-900">TOTAL LIAB + EKUITAS</span>
                            <span className="text-blue-900">{formatCurrency(data.liabilities.totalLiabilities + data.equity.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
