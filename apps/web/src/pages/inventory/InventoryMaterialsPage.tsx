import { useState } from 'react';
import { Search, Download, Plus, Minus, Package, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function InventoryMaterialsPage() {
    const [search, setSearch] = useState('');

    // Sample data - raw materials
    const materials = [
        { id: 1, name: 'Tepung Terigu', sku: 'BB-001', stock: 25, minStock: 10, unit: 'kg', value: 400000, lastUpdate: '2024-01-15' },
        { id: 2, name: 'Gula Pasir', sku: 'BB-002', stock: 8, minStock: 15, unit: 'kg', value: 112000, lastUpdate: '2024-01-14' },
        { id: 3, name: 'Mentega', sku: 'BB-003', stock: 12, minStock: 5, unit: 'kg', value: 480000, lastUpdate: '2024-01-14' },
        { id: 4, name: 'Kopi Arabica', sku: 'BB-004', stock: 3, minStock: 5, unit: 'kg', value: 750000, lastUpdate: '2024-01-13' },
        { id: 5, name: 'Susu Segar', sku: 'BB-005', stock: 20, minStock: 10, unit: 'liter', value: 400000, lastUpdate: '2024-01-15' },
    ];

    const totalValue = materials.reduce((sum, m) => sum + m.value, 0);
    const lowStockCount = materials.filter(m => m.stock <= m.minStock).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stok Bahan Baku</h1>
                    <p className="text-gray-500">Monitor stok bahan baku untuk produksi</p>
                </div>
                <button className="btn-secondary">
                    <Download className="h-4 w-4" />
                    Export Stok
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Bahan</p>
                            <p className="text-xl font-bold text-gray-900">{materials.length}</p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Nilai</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
                        </div>
                    </div>
                </div>
                <div className="card p-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stok Menipis</p>
                            <p className="text-xl font-bold text-red-600">{lowStockCount} item</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert for low stock */}
            {lowStockCount > 0 && (
                <div className="card p-4 bg-red-50 border-red-200">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-red-900">Perhatian: {lowStockCount} bahan baku stoknya menipis</h4>
                            <p className="text-sm text-red-700 mt-1">
                                Segera lakukan purchase order untuk menghindari kehabisan stok.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari bahan baku..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select className="input w-auto">
                        <option value="">Semua Status</option>
                        <option value="low">Stok Menipis</option>
                        <option value="ok">Stok Aman</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
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
                        {materials.map((material) => (
                            <tr key={material.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{material.name}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{material.sku}</td>
                                <td className="px-4 py-3">
                                    <span className={`font-medium ${material.stock <= material.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                                        {material.stock} {material.unit}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{material.minStock}</td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(material.value)}</td>
                                <td className="px-4 py-3">
                                    {material.stock <= material.minStock ? (
                                        <span className="badge badge-danger flex items-center gap-1 w-fit">
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
    );
}
