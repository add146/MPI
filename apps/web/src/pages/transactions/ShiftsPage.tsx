import { useState } from 'react';
import { Plus, Search, Eye, Clock, DollarSign, Play, Square } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ShiftsPage() {
    const [filter, setFilter] = useState('all');

    // Sample data
    const shifts = [
        {
            id: 'SHF-001',
            cashier: 'Budi Santoso',
            startTime: '2024-01-15 08:00',
            endTime: '2024-01-15 16:00',
            openingCash: 500000,
            closingCash: 2850000,
            transactions: 45,
            totalSales: 3250000,
            status: 'closed',
        },
        {
            id: 'SHF-002',
            cashier: 'Siti Aminah',
            startTime: '2024-01-15 16:00',
            endTime: null,
            openingCash: 500000,
            closingCash: null,
            transactions: 28,
            totalSales: 1850000,
            status: 'open',
        },
    ];

    const activeShift = shifts.find(s => s.status === 'open');

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shift Kasir</h1>
                    <p className="text-gray-500">Kelola shift kerja kasir dan kas awal/akhir</p>
                </div>
                {!activeShift ? (
                    <button className="btn-primary">
                        <Play className="h-4 w-4" />
                        Mulai Shift
                    </button>
                ) : (
                    <button className="btn-secondary border-red-300 text-red-600 hover:bg-red-50">
                        <Square className="h-4 w-4" />
                        Tutup Shift
                    </button>
                )}
            </div>

            {/* Active Shift Card */}
            {activeShift && (
                <div className="card p-5 bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-900">Shift Aktif</h3>
                                <p className="text-sm text-green-700">
                                    {activeShift.cashier} • Mulai {activeShift.startTime}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm text-green-700">Transaksi</p>
                                <p className="text-xl font-bold text-green-900">{activeShift.transactions}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-green-700">Total Penjualan</p>
                                <p className="text-xl font-bold text-green-900">{formatCurrency(activeShift.totalSales)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="input w-auto"
                    >
                        <option value="all">Semua Shift</option>
                        <option value="today">Hari Ini</option>
                        <option value="week">Minggu Ini</option>
                        <option value="month">Bulan Ini</option>
                    </select>
                    <input type="date" className="input w-auto" />
                    <input type="date" className="input w-auto" />
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Shift ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Kasir
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Waktu
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Kas Awal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Kas Akhir
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Transaksi
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {shifts.map((shift) => (
                            <tr key={shift.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-sm text-gray-600">{shift.id}</span>
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-900">{shift.cashier}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {shift.startTime} {shift.endTime && `- ${shift.endTime.split(' ')[1]}`}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(shift.openingCash)}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                    {shift.closingCash ? formatCurrency(shift.closingCash) : '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{shift.transactions}</td>
                                <td className="px-4 py-3">
                                    <span className={`badge ${shift.status === 'open' ? 'badge-success' : 'bg-gray-100 text-gray-700'}`}>
                                        {shift.status === 'open' ? 'Aktif' : 'Selesai'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Lihat Detail">
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
