import { useState } from 'react';
import { Search, Download, DollarSign, Clock, User, Calendar, Wallet, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ShiftsPage() {
    const [search, setSearch] = useState('');

    // Current shift info
    const currentShift = {
        cashier: 'Admin',
        startTime: '08:00',
        openingCash: 500000,
        currentCash: 1250000,
        transactions: 24,
        hours: 4.5,
    };

    // Shift history
    const shifts = [
        { id: 1, cashier: 'Admin', date: '15 Jan 2024', start: '08:00', end: '16:00', opening: 500000, closing: 1850000, transactions: 45, variance: 0 },
        { id: 2, cashier: 'Kasir 1', date: '14 Jan 2024', start: '16:00', end: '22:00', opening: 500000, closing: 1420000, transactions: 32, variance: 0 },
        { id: 3, cashier: 'Kasir 2', date: '14 Jan 2024', start: '08:00', end: '16:00', opening: 500000, closing: 1650000, transactions: 38, variance: -10000 },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Shift Kasir</h1>
                    <p className="text-sm text-gray-500">Kelola shift dan kas kasir</p>
                </div>
                <button className="btn-primary text-sm">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Tutup</span> Shift
                </button>
            </div>

            {/* Current Shift Card */}
            <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white overflow-hidden">
                <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-primary-100 text-sm">Shift Aktif</p>
                                <p className="text-lg sm:text-xl font-bold">{currentShift.cashier}</p>
                            </div>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-primary-100 text-sm">Mulai</p>
                            <p className="font-bold">{currentShift.startTime} ({currentShift.hours} jam)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Wallet className="h-4 w-4 text-primary-200" />
                                <span className="text-xs sm:text-sm text-primary-100">Modal Awal</span>
                            </div>
                            <p className="font-bold text-sm sm:text-lg">{formatCurrency(currentShift.openingCash)}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="h-4 w-4 text-primary-200" />
                                <span className="text-xs sm:text-sm text-primary-100">Kas Saat Ini</span>
                            </div>
                            <p className="font-bold text-sm sm:text-lg">{formatCurrency(currentShift.currentCash)}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-primary-200" />
                                <span className="text-xs sm:text-sm text-primary-100">Transaksi</span>
                            </div>
                            <p className="font-bold text-sm sm:text-lg">{currentShift.transactions}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 sm:p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-4 w-4 text-primary-200" />
                                <span className="text-xs sm:text-sm text-primary-100">Selisih</span>
                            </div>
                            <p className="font-bold text-sm sm:text-lg text-green-300">Rp 0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="card p-3 sm:p-4">
                <div className="filter-section">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari kasir..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <input type="date" className="input w-full sm:w-auto" />
                    <button className="btn-secondary text-sm">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-3">
                {shifts.map((shift) => (
                    <div key={shift.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                    <User className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{shift.cashier}</h3>
                                    <p className="text-xs text-gray-500">{shift.date}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">{shift.start} - {shift.end}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                                <p className="text-gray-500">Modal Awal</p>
                                <p className="font-medium">{formatCurrency(shift.opening)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Kas Akhir</p>
                                <p className="font-medium">{formatCurrency(shift.closing)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Transaksi</p>
                                <p className="font-medium">{shift.transactions}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Selisih</p>
                                <p className={`font-bold ${shift.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {shift.variance === 0 ? 'Rp 0' : formatCurrency(shift.variance)}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="desktop-table card overflow-hidden">
                <div className="table-responsive">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kasir</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Waktu</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Modal Awal</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kas Akhir</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Transaksi</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Selisih</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {shifts.map((shift) => (
                                <tr key={shift.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                                                <User className="h-4 w-4 text-primary-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{shift.cashier}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{shift.date}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{shift.start} - {shift.end}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(shift.opening)}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(shift.closing)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{shift.transactions}</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-medium ${shift.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {shift.variance === 0 ? 'Rp 0' : formatCurrency(shift.variance)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
