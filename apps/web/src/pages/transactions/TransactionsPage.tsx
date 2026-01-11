import { useState } from 'react';
import { Search, Download, Eye, Receipt, CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [payment, setPayment] = useState('');

    // Sample data
    const transactions = [
        { id: 'TRX-001', date: '2024-01-15 14:30', customer: 'Budi Santoso', items: 3, total: 85000, payment: 'Tunai', status: 'completed', cashier: 'Admin' },
        { id: 'TRX-002', date: '2024-01-15 13:45', customer: 'Siti Aminah', items: 5, total: 142000, payment: 'QRIS', status: 'completed', cashier: 'Admin' },
        { id: 'TRX-003', date: '2024-01-15 12:20', customer: 'Walk-in', items: 2, total: 36000, payment: 'Tunai', status: 'completed', cashier: 'Kasir 1' },
        { id: 'TRX-004', date: '2024-01-15 11:00', customer: 'Ahmad', items: 1, total: 18000, payment: 'Transfer', status: 'pending', cashier: 'Admin' },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <span className="badge badge-success flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Selesai
                    </span>
                );
            case 'pending':
                return (
                    <span className="badge badge-warning flex items-center gap-1 w-fit">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="badge badge-danger flex items-center gap-1 w-fit">
                        <XCircle className="h-3 w-3" />
                        Batal
                    </span>
                );
            default:
                return <span className="badge">{status}</span>;
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
                    <p className="text-sm text-gray-500">Lihat semua transaksi penjualan</p>
                </div>
                <button className="btn-secondary text-sm">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                </button>
            </div>

            {/* Filter */}
            <div className="card p-3 sm:p-4">
                <div className="filter-section">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari no. transaksi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="input w-full sm:w-auto"
                    >
                        <option value="">Semua Status</option>
                        <option value="completed">Selesai</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Batal</option>
                    </select>
                    <select
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                        className="input w-full sm:w-auto"
                    >
                        <option value="">Semua Pembayaran</option>
                        <option value="tunai">Tunai</option>
                        <option value="qris">QRIS</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-3">
                {transactions.map((trx) => (
                    <div key={trx.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <p className="font-mono text-sm font-medium text-primary-600">{trx.id}</p>
                                <p className="text-xs text-gray-500">{trx.date}</p>
                            </div>
                            {getStatusBadge(trx.status)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                                <p className="text-gray-500">Pelanggan</p>
                                <p className="font-medium">{trx.customer}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Kasir</p>
                                <p className="font-medium">{trx.cashier}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Items</p>
                                <p className="font-medium">{trx.items} item</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Pembayaran</p>
                                <p className="font-medium">{trx.payment}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="font-bold text-gray-900">{formatCurrency(trx.total)}</p>
                            </div>
                            <button className="btn-secondary py-2 text-sm">
                                <Receipt className="h-4 w-4" />
                                Lihat Struk
                            </button>
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
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    No. Transaksi
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Tanggal
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Pelanggan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Items
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Pembayaran
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
                            {transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-sm font-medium text-primary-600">{trx.id}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{trx.date}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{trx.customer}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{trx.items}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(trx.total)}</td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-gray-100 text-gray-700">{trx.payment}</span>
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(trx.status)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Lihat Struk">
                                                <Receipt className="h-4 w-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 order-2 sm:order-1">
                    Menampilkan 1-4 dari 4 transaksi
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button className="btn-secondary px-3 py-2 text-sm" disabled>
                        Prev
                    </button>
                    <button className="btn-primary px-3 py-2 text-sm">1</button>
                    <button className="btn-secondary px-3 py-2 text-sm">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
