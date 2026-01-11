import { useState } from 'react';
import { Search, Calendar, Star, TrendingUp, TrendingDown, Gift, Download } from 'lucide-react';

export default function PointsHistoryPage() {
    const [search, setSearch] = useState('');
    const [type, setType] = useState('');

    // Sample data
    const history = [
        { id: 1, customer: 'Budi Santoso', type: 'earn', points: 150, description: 'Transaksi #TRX-001', date: '2024-01-15 14:30' },
        { id: 2, customer: 'Budi Santoso', type: 'redeem', points: -500, description: 'Tukar diskon Rp 5.000', date: '2024-01-14 10:15' },
        { id: 3, customer: 'Siti Aminah', type: 'earn', points: 85, description: 'Transaksi #TRX-002', date: '2024-01-14 09:45' },
        { id: 4, customer: 'Ahmad Dahlan', type: 'earn', points: 200, description: 'Transaksi #TRX-003', date: '2024-01-13 16:20' },
        { id: 5, customer: 'Maria Garcia', type: 'bonus', points: 1000, description: 'Bonus naik level Distributor', date: '2024-01-12 11:00' },
    ];

    const stats = [
        { label: 'Total Poin Diberikan', value: '125,850', icon: TrendingUp, color: 'text-green-600' },
        { label: 'Total Poin Ditukar', value: '45,200', icon: Gift, color: 'text-purple-600' },
        { label: 'Poin Aktif', value: '80,650', icon: Star, color: 'text-amber-500' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat Poin</h1>
                    <p className="text-gray-500">Lihat semua aktivitas perolehan dan penukaran poin</p>
                </div>
                <button className="btn-secondary">
                    <Download className="h-4 w-4" />
                    Export
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="card p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{stat.label}</p>
                                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pelanggan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="input w-auto"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="earn">Perolehan</option>
                        <option value="redeem">Penukaran</option>
                        <option value="bonus">Bonus</option>
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
                                Tanggal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Pelanggan
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Tipe
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Deskripsi
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                Poin
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {history.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {item.date}
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    {item.customer}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`badge ${item.type === 'earn' ? 'badge-success' :
                                            item.type === 'redeem' ? 'badge-primary' :
                                                'badge-warning'
                                        }`}>
                                        {item.type === 'earn' ? 'Perolehan' :
                                            item.type === 'redeem' ? 'Penukaran' : 'Bonus'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {item.description}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <span className={`font-medium ${item.points > 0 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {item.points > 0 ? '+' : ''}{item.points.toLocaleString()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
