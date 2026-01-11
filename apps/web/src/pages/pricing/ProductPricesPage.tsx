import { useState } from 'react';
import { Search, Edit, Save, X } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProductPricesPage() {
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Sample data - price per level
    const products = [
        {
            id: '1',
            name: 'Roti Tawar',
            sku: 'RTW-001',
            basePrice: 18000,
            prices: {
                retail: 18000,
                reseller: 16200,
                agen: 14400,
                distributor: 12600,
            },
        },
        {
            id: '2',
            name: 'Kopi Susu Aren',
            sku: 'KSA-001',
            basePrice: 18000,
            prices: {
                retail: 18000,
                reseller: 16000,
                agen: 14000,
                distributor: 12000,
            },
        },
        {
            id: '3',
            name: 'Donat Coklat',
            sku: 'DNT-001',
            basePrice: 8000,
            prices: {
                retail: 8000,
                reseller: 7200,
                agen: 6400,
                distributor: 5600,
            },
        },
    ];

    const levels = ['retail', 'reseller', 'agen', 'distributor'];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Harga Produk per Level</h1>
                    <p className="text-gray-500">Atur harga jual produk untuk setiap tingkat pelanggan</p>
                </div>
            </div>

            {/* Info */}
            <div className="card p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-700">
                    <strong>Tips:</strong> Harga akan otomatis diterapkan saat pelanggan bertransaksi sesuai levelnya.
                    Klik tombol edit untuk mengubah harga per level.
                </p>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari produk..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Prices Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Produk
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                HPP
                            </th>
                            {levels.map((level) => (
                                <th key={level} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    {level.charAt(0).toUpperCase() + level.slice(1)}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.sku}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {formatCurrency(product.basePrice)}
                                </td>
                                {levels.map((level) => (
                                    <td key={level} className="px-4 py-3">
                                        {editingId === product.id ? (
                                            <input
                                                type="number"
                                                defaultValue={product.prices[level as keyof typeof product.prices]}
                                                className="input w-24 text-sm"
                                            />
                                        ) : (
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatCurrency(product.prices[level as keyof typeof product.prices])}
                                            </span>
                                        )}
                                    </td>
                                ))}
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        {editingId === product.id ? (
                                            <>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-1.5 hover:bg-green-100 rounded-lg"
                                                >
                                                    <Save className="h-4 w-4 text-green-600" />
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                                                >
                                                    <X className="h-4 w-4 text-gray-500" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setEditingId(product.id)}
                                                className="p-1.5 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Edit className="h-4 w-4 text-gray-500" />
                                            </button>
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
