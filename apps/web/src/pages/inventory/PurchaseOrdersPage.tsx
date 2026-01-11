import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PurchaseOrdersPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');

    // Sample data
    const orders = [
        {
            id: 'PO-2024-001',
            supplier: 'PT Tepung Indonesia',
            items: 3,
            total: 2500000,
            status: 'pending',
            date: '2024-01-15',
            expectedDelivery: '2024-01-18',
        },
        {
            id: 'PO-2024-002',
            supplier: 'CV Bahan Makanan',
            items: 5,
            total: 4800000,
            status: 'approved',
            date: '2024-01-14',
            expectedDelivery: '2024-01-17',
        },
        {
            id: 'PO-2024-003',
            supplier: 'UD Susu Segar',
            items: 2,
            total: 1200000,
            status: 'received',
            date: '2024-01-12',
            expectedDelivery: '2024-01-15',
        },
        {
            id: 'PO-2024-004',
            supplier: 'PT Kopi Nusantara',
            items: 1,
            total: 3500000,
            status: 'cancelled',
            date: '2024-01-10',
            expectedDelivery: '-',
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
            case 'approved':
                return (
                    <span className="badge badge-primary flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Disetujui
                    </span>
                );
            case 'received':
                return (
                    <span className="badge badge-success flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Diterima
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="badge badge-danger flex items-center gap-1 w-fit">
                        <XCircle className="h-3 w-3" />
                        Dibatalkan
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
                    <h1 className="text-2xl font-bold text-gray-900">Purchase Order</h1>
                    <p className="text-gray-500">Kelola pembelian bahan baku dari supplier</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Buat PO Baru
                </button>
            </div>

            {/* Filter */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari no. PO atau supplier..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="input w-auto"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="approved">Disetujui</option>
                        <option value="received">Diterima</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                No. PO
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Supplier
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Items
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Total
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
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        <span className="font-mono text-sm font-medium text-primary-600">{order.id}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-gray-900">{order.supplier}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{order.items} item</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                                <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Lihat Detail">
                                            <Eye className="h-4 w-4 text-gray-500" />
                                        </button>
                                        {order.status === 'pending' && (
                                            <>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit">
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </button>
                                                <button className="p-1.5 hover:bg-red-50 rounded-lg" title="Batalkan">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </button>
                                            </>
                                        )}
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
