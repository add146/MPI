import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';

export default function BrandsPage() {
    const [search, setSearch] = useState('');

    const brands = [
        { id: 1, name: 'Brand Premium', description: 'Produk premium berkualitas tinggi', productCount: 15 },
        { id: 2, name: 'Local Best', description: 'Produk lokal pilihan', productCount: 28 },
        { id: 3, name: 'Home Made', description: 'Produk buatan sendiri', productCount: 42 },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Brand</h1>
                    <p className="text-gray-500">Kelola brand/merek produk</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Tambah Brand
                </button>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari brand..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Brands Table */}
            <div className="card overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Brand
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Deskripsi
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Produk
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {brands.map((brand) => (
                            <tr key={brand.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-primary-500" />
                                        </div>
                                        <span className="font-medium text-gray-900">{brand.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{brand.description}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{brand.productCount} produk</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
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
    );
}
