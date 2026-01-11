import { useState } from 'react';
import { Plus, Search, Eye, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function AdjustmentsPage() {
    const [search, setSearch] = useState('');

    // Sample data
    const adjustments = [
        { id: 'ADJ-001', item: 'Tepung Terigu', sku: 'BB-001', type: 'increase', qty: 10, unit: 'kg', reason: 'Penerimaan PO', user: 'Admin', date: '2024-01-15 14:30' },
        { id: 'ADJ-002', item: 'Gula Pasir', sku: 'BB-002', type: 'decrease', qty: -2, unit: 'kg', reason: 'Rusak/Kadaluarsa', user: 'Admin', date: '2024-01-14 10:15' },
        { id: 'ADJ-003', item: 'Roti Tawar', sku: 'RTW-001', type: 'decrease', qty: -5, unit: 'pcs', reason: 'Opname - Selisih', user: 'Kasir', date: '2024-01-13 09:00' },
        { id: 'ADJ-004', item: 'Kopi Arabica', sku: 'BB-004', type: 'increase', qty: 5, unit: 'kg', reason: 'Penerimaan PO', user: 'Admin', date: '2024-01-12 16:45' },
    ];

    const reasons = [
        'Penerimaan PO',
        'Rusak/Kadaluarsa',
        'Opname - Selisih',
        'Produksi',
        'Retur',
        'Lainnya',
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Adjustment Stok</h1>
                    <p className="text-gray-500">Catat penyesuaian stok manual (koreksi, opname, dll)</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Adjustment Baru
                </button>
            </div>

            {/* Info */}
            <div className="card p-4 bg-amber-50 border-amber-200">
                <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-900">Penting</h4>
                        <p className="text-sm text-amber-700 mt-1">
                            Adjustment stok akan langsung mengubah jumlah stok. Pastikan alasan dan jumlah sudah benar.
                            Semua adjustment akan tercatat di log untuk keperluan audit.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari item..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select className="input w-auto">
                        <option value="">Semua Tipe</option>
                        <option value="increase">Penambahan</option>
                        <option value="decrease">Pengurangan</option>
                    </select>
                    <select className="input w-auto">
                        <option value="">Semua Alasan</option>
                        {reasons.map((reason) => (
                            <option key={reason} value={reason}>{reason}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                No. Adj
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Item
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Tipe
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Qty
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Alasan
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                User
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Tanggal
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {adjustments.map((adj) => (
                            <tr key={adj.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-sm text-gray-600">{adj.id}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium text-gray-900">{adj.item}</p>
                                        <p className="text-sm text-gray-500">{adj.sku}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {adj.type === 'increase' ? (
                                        <span className="badge badge-success flex items-center gap-1 w-fit">
                                            <TrendingUp className="h-3 w-3" />
                                            Tambah
                                        </span>
                                    ) : (
                                        <span className="badge badge-danger flex items-center gap-1 w-fit">
                                            <TrendingDown className="h-3 w-3" />
                                            Kurang
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`font-medium ${adj.qty > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {adj.qty > 0 ? '+' : ''}{adj.qty} {adj.unit}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{adj.reason}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{adj.user}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{adj.date}</td>
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
