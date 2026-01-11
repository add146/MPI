import { useState } from 'react';
import { Plus, Search, Download, Eye, Edit, Trash2, FlaskConical, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RawMaterialsPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // Sample data
    const materials = [
        { id: 1, name: 'Tepung Terigu', sku: 'RM-001', category: 'Bahan Dasar', unit: 'kg', stock: 25, minStock: 10, price: 12000, status: 'ok' },
        { id: 2, name: 'Gula Pasir', sku: 'RM-002', category: 'Bahan Dasar', unit: 'kg', stock: 8, minStock: 15, price: 14000, status: 'low' },
        { id: 3, name: 'Kopi Arabica', sku: 'RM-003', category: 'Minuman', unit: 'kg', stock: 3, minStock: 5, price: 180000, status: 'low' },
        { id: 4, name: 'Mentega', sku: 'RM-004', category: 'Bahan Dasar', unit: 'kg', stock: 12, minStock: 5, price: 28000, status: 'ok' },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bahan Baku</h1>
                    <p className="text-sm text-gray-500">Kelola stok bahan baku untuk produksi</p>
                </div>
                <div className="action-buttons">
                    <button className="btn-secondary text-sm">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button className="btn-primary text-sm">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Tambah</span> Bahan
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="card p-3 sm:p-4">
                <div className="filter-section">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari bahan baku..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input w-full sm:w-auto"
                    >
                        <option value="">Semua Kategori</option>
                        <option value="bahan-dasar">Bahan Dasar</option>
                        <option value="minuman">Minuman</option>
                    </select>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-3">
                {materials.map((material) => (
                    <div key={material.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <FlaskConical className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{material.name}</h3>
                                    <p className="text-xs text-gray-500">{material.sku}</p>
                                </div>
                            </div>
                            {material.status === 'low' ? (
                                <span className="badge badge-warning flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Menipis
                                </span>
                            ) : (
                                <span className="badge badge-success">Aman</span>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                                <p className="text-gray-500">Stok</p>
                                <p className={`font-bold ${material.status === 'low' ? 'text-red-600' : 'text-gray-900'}`}>
                                    {material.stock} {material.unit}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Min. Stok</p>
                                <p className="font-medium">{material.minStock} {material.unit}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Harga/Unit</p>
                                <p className="font-medium text-primary-600">{formatCurrency(material.price)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Kategori</p>
                                <p className="font-medium">{material.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <button className="flex-1 btn-secondary py-2 text-sm">
                                <Eye className="h-4 w-4" />
                                Detail
                            </button>
                            <button className="flex-1 btn-secondary py-2 text-sm">
                                <Edit className="h-4 w-4" />
                                Edit
                            </button>
                            <button className="p-2 hover:bg-red-50 rounded-lg">
                                <Trash2 className="h-4 w-4 text-red-500" />
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
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Bahan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Kategori</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stok</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Harga/Unit</th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {materials.map((material) => (
                                <tr key={material.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                                <FlaskConical className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <span className="font-medium text-gray-900">{material.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{material.sku}</td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-gray-100 text-gray-700">{material.category}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`font-medium ${material.status === 'low' ? 'text-red-600' : 'text-gray-900'}`}>
                                            {material.stock} {material.unit}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {formatCurrency(material.price)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {material.status === 'low' ? (
                                            <span className="badge badge-warning flex items-center gap-1 w-fit">
                                                <AlertTriangle className="h-3 w-3" />
                                                Menipis
                                            </span>
                                        ) : (
                                            <span className="badge badge-success">Aman</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </button>
                                            <button className="p-1.5 hover:bg-red-50 rounded-lg">
                                                <Trash2 className="h-4 w-4 text-red-500" />
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
                    Menampilkan 1-4 dari 4 bahan
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                    <button className="btn-secondary px-3 py-2 text-sm" disabled>Prev</button>
                    <button className="btn-primary px-3 py-2 text-sm">1</button>
                    <button className="btn-secondary px-3 py-2 text-sm">Next</button>
                </div>
            </div>
        </div>
    );
}
