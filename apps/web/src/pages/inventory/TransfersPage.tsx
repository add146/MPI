import { useState } from 'react';
import { Plus, Search, Eye, ArrowRight, CheckCircle, Clock, Truck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TransfersPage() {
    const [search, setSearch] = useState('');

    // Sample data
    const transfers = [
        {
            id: 'TRF-001',
            from: 'Gudang Pusat',
            to: 'Outlet Cabang A',
            items: 5,
            totalValue: 1500000,
            status: 'completed',
            date: '2024-01-15',
        },
        {
            id: 'TRF-002',
            from: 'Gudang Pusat',
            to: 'Outlet Cabang B',
            items: 3,
            totalValue: 850000,
            status: 'in_transit',
            date: '2024-01-14',
        },
        {
            id: 'TRF-003',
            from: 'Outlet Cabang A',
            to: 'Outlet Cabang C',
            items: 2,
            totalValue: 420000,
            status: 'pending',
            date: '2024-01-13',
        },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="badge badge-warning flex items-center gap-1 w-fit">
                        <Clock className="h-3 w-3" />
                        Menunggu
                    </span>
                );
            case 'in_transit':
                return (
                    <span className="badge badge-primary flex items-center gap-1 w-fit">
                        <Truck className="h-3 w-3" />
                        Dalam Perjalanan
                    </span>
                );
            case 'completed':
                return (
                    <span className="badge badge-success flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Selesai
                    </span>
                );
            default:
                return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transfer Stok</h1>
                    <p className="text-gray-500">Kelola transfer barang antar outlet</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Transfer Baru
                </button>
            </div>

            {/* Info */}
            <div className="card p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-700">
                    <strong>Info:</strong> Transfer stok digunakan untuk memindahkan barang dari satu outlet ke outlet lainnya.
                    Stok akan otomatis dikurangi dari outlet asal dan ditambahkan ke outlet tujuan setelah transfer selesai.
                </p>
            </div>

            {/* Filter */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari transfer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select className="input w-auto">
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="in_transit">Dalam Perjalanan</option>
                        <option value="completed">Selesai</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                No. Transfer
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Dari / Ke
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Items
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Nilai
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Tanggal
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
                        {transfers.map((transfer) => (
                            <tr key={transfer.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <span className="font-mono text-sm font-medium text-primary-600">{transfer.id}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-900">{transfer.from}</span>
                                        <ArrowRight className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-900">{transfer.to}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{transfer.items} item</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(transfer.totalValue)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{transfer.date}</td>
                                <td className="px-4 py-3">{getStatusBadge(transfer.status)}</td>
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
