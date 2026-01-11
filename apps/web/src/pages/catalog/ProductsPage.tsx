import { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');

    // Sample data
    const products = [
        { id: 1, name: 'Roti Tawar', sku: 'RTW-001', category: 'Makanan', brand: 'Home Made', price: 18000, stock: 45, status: 'active' },
        { id: 2, name: 'Kopi Susu Aren', sku: 'KSA-001', category: 'Minuman', brand: 'Brand Premium', price: 18000, stock: 28, status: 'active' },
        { id: 3, name: 'Donat Coklat', sku: 'DNT-001', category: 'Snack', brand: 'Home Made', price: 8000, stock: 8, status: 'low_stock' },
        { id: 4, name: 'Croissant Butter', sku: 'CRS-001', category: 'Makanan', brand: 'Brand Premium', price: 15000, stock: 0, status: 'out_of_stock' },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Responsive */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Produk Jadi</h1>
                    <p className="text-sm text-gray-500">Kelola daftar produk yang dijual di outlet Anda</p>
                </div>
                <div className="action-buttons">
                    <button className="btn-secondary text-sm">
                        <Upload className="h-4 w-4" />
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <button className="btn-secondary text-sm">
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    <button className="btn-primary text-sm">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Tambah</span> Produk
                    </button>
                </div>
            </div>

            {/* Filter Section - Responsive */}
            <div className="card p-3 sm:p-4">
                <div className="filter-section">
                    <div className="relative flex-1 min-w-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
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
                        <option value="makanan">Makanan</option>
                        <option value="minuman">Minuman</option>
                        <option value="snack">Snack</option>
                    </select>
                    <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="input w-full sm:w-auto"
                    >
                        <option value="">Semua Brand</option>
                        <option value="home-made">Home Made</option>
                        <option value="brand-premium">Brand Premium</option>
                    </select>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-3">
                {products.map((product) => (
                    <div key={product.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Package className="h-6 w-6 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                                    <p className="text-xs text-gray-500">{product.sku}</p>
                                </div>
                            </div>
                            <span className={`badge text-xs ${product.status === 'active' ? 'badge-success' :
                                    product.status === 'low_stock' ? 'badge-warning' : 'badge-danger'
                                }`}>
                                {product.status === 'active' ? 'Aktif' :
                                    product.status === 'low_stock' ? 'Stok Rendah' : 'Habis'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div>
                                <p className="text-gray-500">Kategori</p>
                                <p className="font-medium">{product.category}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Harga</p>
                                <p className="font-medium text-primary-600">{formatCurrency(product.price)}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Stok</p>
                                <p className="font-medium">{product.stock}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Brand</p>
                                <p className="font-medium">{product.brand}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <button className="flex-1 btn-secondary py-2 text-sm">
                                <Eye className="h-4 w-4" />
                                Lihat
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
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Produk
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    SKU
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Kategori
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Harga
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Stok
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
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Package className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                                    <td className="px-4 py-3">
                                        <span className="badge bg-gray-100 text-gray-700">{product.category}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{product.stock}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${product.status === 'active' ? 'badge-success' :
                                                product.status === 'low_stock' ? 'badge-warning' : 'badge-danger'
                                            }`}>
                                            {product.status === 'active' ? 'Aktif' :
                                                product.status === 'low_stock' ? 'Stok Rendah' : 'Habis'}
                                        </span>
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

            {/* Pagination - Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500 order-2 sm:order-1">
                    Menampilkan 1-4 dari 4 produk
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
