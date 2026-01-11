import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { rawMaterialsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
    Plus,
    Search,
    Download,
    Upload,
    Edit,
    Trash2,
    Eye,
    Package,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
} from 'lucide-react';

export default function RawMaterialsPage() {
    const { currentOutletId } = useAuthStore();
    const [search, setSearch] = useState('');
    const [supplier, setSupplier] = useState('');
    const [stockStatus, setStockStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['raw-materials', currentOutletId],
        queryFn: () => rawMaterialsApi.getAll(currentOutletId!),
        enabled: !!currentOutletId,
    });

    const materials = data?.data || [];
    const filteredMaterials = materials.filter((m: any) => {
        if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (stockStatus === 'low' && m.stockQty >= m.minStock) return false;
        if (stockStatus === 'ok' && m.stockQty < m.minStock) return false;
        return true;
    });
    const totalItems = filteredMaterials.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedMaterials = filteredMaterials.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bahan Baku</h1>
                    <p className="text-gray-500">Kelola stok bahan baku untuk produksi</p>
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
                        Tambah Bahan Baku
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
                                placeholder="Cari bahan baku..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input pl-10"
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            className="input"
                        >
                            <option value="">Semua Supplier</option>
                            <option value="supplier1">Supplier A</option>
                            <option value="supplier2">Supplier B</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={stockStatus}
                            onChange={(e) => setStockStatus(e.target.value)}
                            className="input"
                        >
                            <option value="">Semua Status</option>
                            <option value="low">Stok Menipis</option>
                            <option value="ok">Stok Aman</option>
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
                                    Bahan Baku
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    SKU
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Satuan
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Harga Beli
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Stok
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Min. Stok
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
                            ) : paginatedMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                                        <p>Belum ada bahan baku</p>
                                        <p className="text-sm">Klik tombol "Tambah Bahan Baku" untuk menambah bahan baru</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedMaterials.map((material: any) => (
                                    <tr key={material.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                                    <Package className="h-5 w-5 text-amber-500" />
                                                </div>
                                                <p className="font-medium text-gray-900">{material.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {material.sku || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {material.unit}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                            {formatCurrency(material.purchasePrice)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            <span className={material.stockQty <= material.minStock ? 'text-red-600 font-medium' : ''}>
                                                {material.stockQty}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {material.minStock}
                                        </td>
                                        <td className="px-4 py-3">
                                            {material.stockQty <= material.minStock ? (
                                                <span className="badge badge-warning flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Menipis
                                                </span>
                                            ) : (
                                                <span className="badge badge-success">Aman</span>
                                            )}
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
                            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} bahan baku
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
