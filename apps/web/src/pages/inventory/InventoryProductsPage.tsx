import { useState } from 'react';
import { Search, Download, Plus, Minus, Package, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function InventoryProductsPage() {
    const [search, setSearch] = useState('');

    // Sample data
    const products = [
        { id: 1, name: 'Roti Tawar', sku: 'RTW-001', stock: 45, minStock: 20, unit: 'pcs', value: 810000, lastUpdate: '2024-01-15' },
        { id: 2, name: 'Kopi Susu Aren', sku: 'KSA-001', stock: 8, minStock: 15, unit: 'pcs', value: 144000, lastUpdate: '2024-01-15' },
        { id: 3, name: 'Donat Coklat', sku: 'DNT-001', stock: 32, minStock: 10, unit: 'pcs', value: 256000, lastUpdate: '2024-01-14' },
        { id: 4, name: 'Croissant Butter', sku: 'CRS-001', stock: 18, minStock: 8, unit: 'pcs', value: 270000, lastUpdate: '2024-01-14' },
    ];

    const totalValue = products.reduce((sum, p) => sum + p.value, 0);
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Stok Produk</h1>
                    <p className="text-sm text-gray-500">Monitor stok produk jadi di outlet</p>
                </div>
                <button className="btn-secondary text-sm">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export Stok</span>
                </button>
            </div>

            {/* Stats - Responsive Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="card p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500 truncate">Total Item</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{products.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card p-3 sm:p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500 truncate">Total Nilai</p>
                            <p className="text-sm sm:text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
                        </div>
                    </div>
                </div>
                <div className="card p-3 sm:p-4 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-500 truncate">Stok Menipis</p>
                            <p className="text-lg sm:text-xl font-bold text-gray-900">{lowStockCount} item</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
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
                    <select className="input w-full sm:w-auto">
                        <option value="">Semua Status</option>
                        <option value="low">Stok Menipis</option>
                        <option value="ok">Stok Aman</option>
                    </select>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-card space-y-3">
                {products.map((product) => (
                    <div key={product.id} className="card p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-medium text-gray-900">{product.name}</h3>
                                <p className="text-xs text-gray-500">{product.sku}</p>
                            </div>
                            {product.stock <= product.minStock ? (
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
                                <p className={`font-bold ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                                    {product.stock} {product.unit}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Min. Stok</p>
                                <p className="font-medium">{product.minStock}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-gray-500">Nilai</p>
                                <p className="font-medium text-primary-600">{formatCurrency(product.value)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            <button className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-1">
                                <Plus className="h-4 w-4 text-green-600" />
                                Tambah
                            </button>
                            <button className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-1">
                                <Minus className="h-4 w-4 text-red-600" />
                                Kurangi
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
                                    Stok
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Min. Stok
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Nilai
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Adjustment
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                                            {product.stock} {product.unit}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{product.minStock}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(product.value)}</td>
                                    <td className="px-4 py-3">
                                        {product.stock <= product.minStock ? (
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
                                            <button className="p-1.5 hover:bg-green-100 rounded-lg" title="Tambah Stok">
                                                <Plus className="h-4 w-4 text-green-600" />
                                            </button>
                                            <button className="p-1.5 hover:bg-red-100 rounded-lg" title="Kurangi Stok">
                                                <Minus className="h-4 w-4 text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
