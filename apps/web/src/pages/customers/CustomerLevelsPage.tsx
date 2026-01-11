import { useState } from 'react';
import { Star, TrendingUp, Users, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomerLevelsPage() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Sample data
    const customers = [
        { id: 1, name: 'Budi Santoso', phone: '081234567890', level: 'Agen', points: 2850, nextLevel: 'Distributor', pointsNeeded: 7150 },
        { id: 2, name: 'Siti Aminah', phone: '081234567891', level: 'Reseller', points: 780, nextLevel: 'Agen', pointsNeeded: 1220 },
        { id: 3, name: 'Ahmad Dahlan', phone: '081234567892', level: 'Retail', points: 120, nextLevel: 'Reseller', pointsNeeded: 380 },
        { id: 4, name: 'Maria Garcia', phone: '081234567893', level: 'Distributor', points: 15000, nextLevel: '-', pointsNeeded: 0 },
    ];

    const levelStats = [
        { level: 'Retail', count: 145, icon: '🏷️', color: 'bg-gray-100 text-gray-700' },
        { level: 'Reseller', count: 53, icon: '🏪', color: 'bg-blue-100 text-blue-700' },
        { level: 'Agen', count: 18, icon: '📦', color: 'bg-purple-100 text-purple-700' },
        { level: 'Distributor', count: 5, icon: '🚛', color: 'bg-amber-100 text-amber-700' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Level Pelanggan</h1>
                <p className="text-gray-500">Monitor dan kelola tingkatan pelanggan berdasarkan poin</p>
            </div>

            {/* Level Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {levelStats.map((stat) => (
                    <div key={stat.level} className="card p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{stat.icon}</span>
                            <span className={`badge ${stat.color}`}>{stat.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-xl font-bold text-gray-900">{stat.count}</span>
                            <span className="text-sm text-gray-500">pelanggan</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari pelanggan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select className="input w-auto">
                        <option value="">Semua Level</option>
                        <option value="retail">Retail</option>
                        <option value="reseller">Reseller</option>
                        <option value="agen">Agen</option>
                        <option value="distributor">Distributor</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Pelanggan
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Level Saat Ini
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Total Poin
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Progress ke Level Berikutnya
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium text-gray-900">{customer.name}</p>
                                        <p className="text-sm text-gray-500">{customer.phone}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`badge ${customer.level === 'Retail' ? 'bg-gray-100 text-gray-700' :
                                            customer.level === 'Reseller' ? 'bg-blue-100 text-blue-700' :
                                                customer.level === 'Agen' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-amber-100 text-amber-700'
                                        }`}>
                                        {customer.level}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                        <span className="font-medium text-gray-900">{customer.points.toLocaleString()}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {customer.nextLevel !== '-' ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500">
                                                    {customer.pointsNeeded.toLocaleString()} poin lagi → {customer.nextLevel}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-500 rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, (customer.points / (customer.points + customer.pointsNeeded)) * 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="badge badge-success flex items-center gap-1 w-fit">
                                            <TrendingUp className="h-3 w-3" />
                                            Level Tertinggi
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
