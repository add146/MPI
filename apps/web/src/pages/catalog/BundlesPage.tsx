import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Gift, Calendar, Tag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function BundlesPage() {
    const [search, setSearch] = useState('');

    const bundles = [
        {
            id: 1,
            name: 'Paket Hemat Pagi',
            products: ['Roti Tawar', 'Kopi Susu'],
            totalPrice: 35000,
            bundlePrice: 28000,
            discount: 20,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            isActive: true,
        },
        {
            id: 2,
            name: 'Combo Snack',
            products: ['Donat Coklat', 'Teh Manis', 'Kentang Goreng'],
            totalPrice: 45000,
            bundlePrice: 35000,
            discount: 22,
            startDate: '2024-02-01',
            endDate: '2024-06-30',
            isActive: true,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bundle Promo</h1>
                    <p className="text-gray-500">Kelola paket bundling produk dengan harga spesial</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Buat Bundle
                </button>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari bundle..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                    <select className="input w-auto">
                        <option value="">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="inactive">Nonaktif</option>
                    </select>
                </div>
            </div>

            {/* Bundles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundles.map((bundle) => (
                    <div key={bundle.id} className="card overflow-hidden">
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <Gift className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg">
                                        <Edit className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2">{bundle.name}</h3>

                            <div className="flex flex-wrap gap-1 mb-4">
                                {bundle.products.map((product, idx) => (
                                    <span key={idx} className="badge bg-gray-100 text-gray-700">
                                        {product}
                                    </span>
                                ))}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Harga Normal:</span>
                                    <span className="text-gray-600 line-through">{formatCurrency(bundle.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Harga Bundle:</span>
                                    <span className="font-semibold text-green-600">{formatCurrency(bundle.bundlePrice)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Calendar className="h-3.5 w-3.5" />
                                {bundle.startDate} - {bundle.endDate}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Tag className="h-3.5 w-3.5 text-green-600" />
                                <span className="text-xs font-medium text-green-600">-{bundle.discount}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
