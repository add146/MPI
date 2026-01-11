import { Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function BalanceSheetPage() {
    // Sample Balance Sheet data
    const data = {
        period: 'Per 31 Januari 2024',
        assets: {
            current: {
                cash: 25000000,
                accountsReceivable: 8500000,
                inventory: 35000000,
                prepaid: 2000000,
                totalCurrent: 70500000,
            },
            fixed: {
                equipment: 50000000,
                depreciation: -15000000,
                furniture: 10000000,
                totalFixed: 45000000,
            },
            totalAssets: 115500000,
        },
        liabilities: {
            current: {
                accountsPayable: 12000000,
                accruedExpenses: 3500000,
                totalCurrent: 15500000,
            },
            longTerm: {
                loans: 20000000,
                totalLongTerm: 20000000,
            },
            totalLiabilities: 35500000,
        },
        equity: {
            capital: 50000000,
            retainedEarnings: 30000000,
            totalEquity: 80000000,
        },
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Neraca (Balance Sheet)</h1>
                    <p className="text-gray-500">Posisi keuangan bisnis pada periode tertentu</p>
                </div>
                <div className="flex items-center gap-2">
                    <select className="input w-auto">
                        <option>31 Januari 2024</option>
                        <option>31 Desember 2023</option>
                        <option>30 November 2023</option>
                    </select>
                    <button className="btn-primary">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5 bg-blue-50 border-blue-200">
                    <p className="text-sm text-blue-700">Total Aset</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(data.assets.totalAssets)}</p>
                </div>
                <div className="card p-5 bg-red-50 border-red-200">
                    <p className="text-sm text-red-700">Total Kewajiban</p>
                    <p className="text-2xl font-bold text-red-900">{formatCurrency(data.liabilities.totalLiabilities)}</p>
                </div>
                <div className="card p-5 bg-green-50 border-green-200">
                    <p className="text-sm text-green-700">Total Ekuitas</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(data.equity.totalEquity)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Assets */}
                <div className="card overflow-hidden">
                    <div className="p-5 border-b border-gray-200 bg-blue-50">
                        <h3 className="font-semibold text-blue-900">ASET</h3>
                    </div>
                    <div className="p-5 space-y-6">
                        {/* Current Assets */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Aset Lancar</h4>
                            <div className="space-y-2 pl-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Kas & Bank</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.cash)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Piutang Usaha</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.accountsReceivable)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Persediaan</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.inventory)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Biaya Dibayar Dimuka</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.current.prepaid)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Total Aset Lancar</span>
                                    <span>{formatCurrency(data.assets.current.totalCurrent)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Assets */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Aset Tetap</h4>
                            <div className="space-y-2 pl-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Peralatan</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.fixed.equipment)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Akumulasi Penyusutan</span>
                                    <span className="text-red-600">({formatCurrency(Math.abs(data.assets.fixed.depreciation))})</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Perlengkapan</span>
                                    <span className="text-gray-900">{formatCurrency(data.assets.fixed.furniture)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Total Aset Tetap</span>
                                    <span>{formatCurrency(data.assets.fixed.totalFixed)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between py-3 bg-blue-100 px-4 rounded-lg font-bold">
                            <span className="text-blue-900">TOTAL ASET</span>
                            <span className="text-blue-900">{formatCurrency(data.assets.totalAssets)}</span>
                        </div>
                    </div>
                </div>

                {/* Liabilities & Equity */}
                <div className="card overflow-hidden">
                    <div className="p-5 border-b border-gray-200 bg-gray-50">
                        <h3 className="font-semibold text-gray-900">KEWAJIBAN & EKUITAS</h3>
                    </div>
                    <div className="p-5 space-y-6">
                        {/* Current Liabilities */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Kewajiban Jangka Pendek</h4>
                            <div className="space-y-2 pl-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Hutang Usaha</span>
                                    <span className="text-gray-900">{formatCurrency(data.liabilities.current.accountsPayable)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Beban yang Masih Harus Dibayar</span>
                                    <span className="text-gray-900">{formatCurrency(data.liabilities.current.accruedExpenses)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-gray-50 px-2 rounded font-medium">
                                    <span>Total Kewajiban Lancar</span>
                                    <span>{formatCurrency(data.liabilities.current.totalCurrent)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Long Term Liabilities */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Kewajiban Jangka Panjang</h4>
                            <div className="space-y-2 pl-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Pinjaman Bank</span>
                                    <span className="text-gray-900">{formatCurrency(data.liabilities.longTerm.loans)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-red-50 px-2 rounded font-medium">
                                    <span className="text-red-900">Total Kewajiban</span>
                                    <span className="text-red-900">{formatCurrency(data.liabilities.totalLiabilities)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Equity */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Ekuitas</h4>
                            <div className="space-y-2 pl-4">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Modal Disetor</span>
                                    <span className="text-gray-900">{formatCurrency(data.equity.capital)}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Laba Ditahan</span>
                                    <span className="text-gray-900">{formatCurrency(data.equity.retainedEarnings)}</span>
                                </div>
                                <div className="flex justify-between py-2 bg-green-50 px-2 rounded font-medium">
                                    <span className="text-green-900">Total Ekuitas</span>
                                    <span className="text-green-900">{formatCurrency(data.equity.totalEquity)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between py-3 bg-gray-100 px-4 rounded-lg font-bold">
                            <span>TOTAL KEWAJIBAN & EKUITAS</span>
                            <span>{formatCurrency(data.liabilities.totalLiabilities + data.equity.totalEquity)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
