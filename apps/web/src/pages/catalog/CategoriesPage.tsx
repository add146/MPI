import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Grid3X3 } from 'lucide-react';

export default function CategoriesPage() {
    const [search, setSearch] = useState('');

    // Sample data
    const categories = [
        { id: 1, name: 'Makanan', description: 'Produk makanan siap saji', productCount: 24, color: '#10B981' },
        { id: 2, name: 'Minuman', description: 'Berbagai jenis minuman', productCount: 18, color: '#3B82F6' },
        { id: 3, name: 'Snack', description: 'Makanan ringan dan cemilan', productCount: 32, color: '#F59E0B' },
        { id: 4, name: 'Frozen Food', description: 'Produk beku', productCount: 15, color: '#8B5CF6' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Kategori</h1>
                    <p className="text-gray-500">Kelola kategori untuk mengelompokkan produk</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Tambah Kategori
                </button>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <div key={category.id} className="card p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className="h-12 w-12 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${category.color}20` }}
                            >
                                <Grid3X3 className="h-6 w-6" style={{ color: category.color }} />
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
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-600">
                                <strong>{category.productCount}</strong> produk
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
