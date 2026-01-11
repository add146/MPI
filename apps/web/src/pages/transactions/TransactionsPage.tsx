import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { transactionsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
    Search,
    Download,
    Eye,
    Receipt,
    ChevronLeft,
    ChevronRight,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
} from 'lucide-react';

export default function TransactionsPage() {
    const { currentOutletId } = useAuthStore();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['transactions', currentOutletId],
        queryFn: () => transactionsApi.getAll(currentOutletId!),
        enabled: !!currentOutletId,
    });

    const transactions = data?.data || [];
    const filteredTransactions = transactions.filter((t: any) => {
        if (status && t.paymentStatus !== status) return false;
        return true;
    });
    const totalItems = filteredTransactions.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (paymentStatus: string) => {
        switch (paymentStatus) {
            case 'paid':
                return (
                    <span className="badge badge-success flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Selesai
                    </span>
                );
            case 'pending':
                return (
                    <span className="badge badge-warning flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Pending
                    </span>
                );
            case 'refunded':
                return (
                    <span className="badge badge-danger flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        Refund
                    </span>
                );
            default:
                return <span className="badge">{paymentStatus}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
                    <p className="text-gray-500">Lihat semua transaksi penjualan</p>
                </div>
                <button className="btn-secondary">
                    <Download className="h-4 w-4" />
                    Export
                </button>
            </div>

            {/* Filter Section */}
            <div className="card p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="label">Tanggal Mulai</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Tanggal Akhir</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="input"
                        >
                            <option value="">Semua Status</option>
                            <option value="paid">Selesai</option>
                            <option value="pending">Pending</option>
                            <option value="refunded">Refund</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Metode Bayar</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="input"
                        >
                            <option value="">Semua Metode</option>
                            <option value="cash">Tunai</option>
                            <option value="qris">QRIS</option>
                            <option value="transfer">Transfer</option>
                            <option value="debit">Debit</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Cari</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="No. Invoice..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    No. Invoice
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : paginatedTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        <Receipt className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                        <p>Belum ada transaksi</p>
                                        <p className="text-sm">Transaksi akan muncul di sini setelah Anda melakukan penjualan</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedTransactions.map((transaction: any) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-sm font-medium text-primary-600">
                                                #{transaction.id.slice(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(transaction.createdAt).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {transaction.customer?.name || 'Walk-in Customer'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {transaction.items?.length || 0} item
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {formatCurrency(transaction.total)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                                            {transaction.paymentMethod || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {getStatusBadge(transaction.paymentStatus)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center">
                                                <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Lihat Detail">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} transaksi
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === page
                                            ? 'bg-primary-500 text-white'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
