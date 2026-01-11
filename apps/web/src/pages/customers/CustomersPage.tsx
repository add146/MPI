import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { customersApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
    Plus,
    Search,
    Download,
    Upload,
    Edit,
    Trash2,
    Eye,
    Users,
    ChevronLeft,
    ChevronRight,
    Star,
    Phone,
    Mail,
} from 'lucide-react';

export default function CustomersPage() {
    const { currentOutletId } = useAuthStore();
    const [search, setSearch] = useState('');
    const [level, setLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['customers', currentOutletId],
        queryFn: () => customersApi.getAll(currentOutletId!),
        enabled: !!currentOutletId,
    });

    const customers = data?.data || [];
    const filteredCustomers = customers.filter((c: any) => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });
    const totalItems = filteredCustomers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedCustomers = filteredCustomers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getLevelBadgeColor = (levelName: string) => {
        switch (levelName?.toLowerCase()) {
            case 'retail': return 'bg-gray-100 text-gray-700';
            case 'reseller': return 'bg-blue-100 text-blue-700';
            case 'agen': return 'bg-purple-100 text-purple-700';
            case 'distributor': return 'bg-amber-100 text-amber-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Daftar Pelanggan</h1>
                    <p className="text-gray-500">Kelola pelanggan dan lihat riwayat transaksi mereka</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary">
                        <Upload className="h-4 w-4" />
                        Import
                    </button>
                    <button className="btn-secondary">
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                    <button className="btn-primary">
                        <Plus className="h-4 w-4" />
                        Tambah Pelanggan
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="card p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari pelanggan berdasarkan nama, telepon, atau email..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="input"
                        >
                            <option value="">Semua Level</option>
                            <option value="retail">Retail</option>
                            <option value="reseller">Reseller</option>
                            <option value="agen">Agen</option>
                            <option value="distributor">Distributor</option>
                        </select>
                    </div>
                    <div>
                        <select className="input">
                            <option value="">Semua Kota</option>
                            <option value="jakarta">Jakarta</option>
                            <option value="bandung">Bandung</option>
                            <option value="surabaya">Surabaya</option>
                        </select>
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
                                    Pelanggan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Kontak
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Level
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Total Poin
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Total Belanja
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : paginatedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                        <p>Belum ada pelanggan</p>
                                        <p className="text-sm">Klik tombol "Tambah Pelanggan" untuk menambah pelanggan baru</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <span className="text-primary-600 font-medium">
                                                        {customer.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{customer.name}</p>
                                                    <p className="text-sm text-gray-500">{customer.address || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                {customer.phone && (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                        <Phone className="h-3.5 w-3.5" />
                                                        {customer.phone}
                                                    </div>
                                                )}
                                                {customer.email && (
                                                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                        <Mail className="h-3.5 w-3.5" />
                                                        {customer.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge ${getLevelBadgeColor(customer.level?.name)}`}>
                                                {customer.level?.name || 'Retail'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                                                <span className="font-medium text-gray-900">
                                                    {customer.totalPoints?.toLocaleString() || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {formatCurrency(customer.lifetimeSpent || 0)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Lihat Detail">
                                                    <Eye className="h-4 w-4 text-gray-500" />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit">
                                                    <Edit className="h-4 w-4 text-gray-500" />
                                                </button>
                                                <button className="p-1.5 hover:bg-red-50 rounded-lg" title="Hapus">
                                                    <Trash2 className="h-4 w-4 text-red-500" />
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
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} pelanggan
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
