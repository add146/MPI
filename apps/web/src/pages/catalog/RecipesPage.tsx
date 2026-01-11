import { useState } from 'react';
import { Plus, Search, Edit, Trash2, FlaskConical, Package, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RecipesPage() {
    const [search, setSearch] = useState('');

    const recipes = [
        {
            id: 1,
            productName: 'Roti Tawar',
            ingredients: [
                { name: 'Tepung Terigu', qty: 500, unit: 'gr', price: 8000 },
                { name: 'Gula Pasir', qty: 50, unit: 'gr', price: 750 },
                { name: 'Mentega', qty: 100, unit: 'gr', price: 4000 },
                { name: 'Ragi', qty: 10, unit: 'gr', price: 250 },
            ],
            hpp: 13000,
            sellingPrice: 18000,
            margin: 38.5,
        },
        {
            id: 2,
            productName: 'Kopi Susu Aren',
            ingredients: [
                { name: 'Kopi Arabica', qty: 20, unit: 'gr', price: 5000 },
                { name: 'Susu Segar', qty: 150, unit: 'ml', price: 3000 },
                { name: 'Gula Aren', qty: 30, unit: 'gr', price: 1500 },
            ],
            hpp: 9500,
            sellingPrice: 18000,
            margin: 47.2,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Resep Produksi</h1>
                    <p className="text-gray-500">Kelola resep & BOM (Bill of Materials) untuk menghitung HPP</p>
                </div>
                <button className="btn-primary">
                    <Plus className="h-4 w-4" />
                    Tambah Resep
                </button>
            </div>

            {/* Info */}
            <div className="card p-4 bg-amber-50 border-amber-200">
                <div className="flex gap-3">
                    <Calculator className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-amber-900">HPP Otomatis</h4>
                        <p className="text-sm text-amber-700 mt-1">
                            Harga Pokok Produksi (HPP) dihitung otomatis dari total biaya bahan baku dalam resep.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="card p-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari produk atau bahan baku..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Recipes */}
            <div className="space-y-4">
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="card overflow-hidden">
                        {/* Recipe Header */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                    <FlaskConical className="h-5 w-5 text-primary-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{recipe.productName}</h3>
                                    <p className="text-sm text-gray-500">{recipe.ingredients.length} bahan baku</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">HPP</p>
                                    <p className="font-semibold text-gray-900">{formatCurrency(recipe.hpp)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Harga Jual</p>
                                    <p className="font-semibold text-gray-900">{formatCurrency(recipe.sellingPrice)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Margin</p>
                                    <p className="font-semibold text-green-600">{recipe.margin}%</p>
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                    <button className="p-1.5 hover:bg-white rounded-lg">
                                        <Edit className="h-4 w-4 text-gray-500" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Ingredients Table */}
                        <table className="w-full">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Bahan Baku
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Qty
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Harga
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recipe.ingredients.map((ing, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 text-sm text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-gray-400" />
                                                {ing.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{ing.qty} {ing.unit}</td>
                                        <td className="px-4 py-2 text-sm text-gray-600">{formatCurrency(ing.price)}</td>
                                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(ing.price)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
}
