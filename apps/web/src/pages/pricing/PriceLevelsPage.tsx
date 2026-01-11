import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { priceLevelsApi } from '@/lib/api';
import {
    Plus,
    Edit,
    Trash2,
    Tags,
    Star,
    Users,
} from 'lucide-react';

export default function PriceLevelsPage() {
    const { currentOutletId } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ['price-levels', currentOutletId],
        queryFn: () => priceLevelsApi.getAll(currentOutletId!),
        enabled: !!currentOutletId,
    });

    const levels = data?.data || [];

    const getLevelColor = (index: number) => {
        const colors = [
            'bg-gray-100 border-gray-300 text-gray-700',
            'bg-blue-50 border-blue-300 text-blue-700',
            'bg-purple-50 border-purple-300 text-purple-700',
            'bg-amber-50 border-amber-300 text-amber-700',
        ];
        return colors[index % colors.length];
    };

    const getLevelIcon = (index: number) => {
        const icons = ['🏷️', '🏪', '📦', '🚛'];
        return icons[index % icons.length];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Price Levels</h1>
                    <p className="text-gray-500">Kelola tingkatan harga untuk pelanggan (max 4 level)</p>
                </div>
                <button className="btn-primary" disabled={levels.length >= 4}>
                    <Plus className="h-4 w-4" />
                    Tambah Level
                </button>
            </div>

            {/* Info Card */}
            <div className="card p-4 bg-blue-50 border-blue-200">
                <div className="flex gap-3">
                    <Tags className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900">Cara Kerja Multi-Level Pricing</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            Setiap pelanggan memiliki level yang menentukan harga yang mereka dapat.
                            Level dapat naik otomatis berdasarkan total poin yang dikumpulkan.
                        </p>
                    </div>
                </div>
            </div>

            {/* Levels Grid */}
            {isLoading ? (
                <div className="text-center py-8 text-gray-500">Memuat data...</div>
            ) : levels.length === 0 ? (
                <div className="card p-8 text-center">
                    <Tags className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">Belum ada level harga</p>
                    <p className="text-sm text-gray-400">Klik tombol "Tambah Level" untuk membuat level baru</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {levels.map((level: any, index: number) => (
                        <div key={level.id} className={`card p-5 border-2 ${getLevelColor(index)}`}>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl">{getLevelIcon(index)}</span>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 hover:bg-white/50 rounded-lg">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button className="p-1.5 hover:bg-red-100 rounded-lg">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-1">{level.name}</h3>
                            <p className="text-sm opacity-75 mb-4">{level.description || `Level ${index + 1}`}</p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <Star className="h-4 w-4" />
                                        Min. Poin
                                    </span>
                                    <span className="font-semibold">{level.minPoints?.toLocaleString() || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <Tags className="h-4 w-4" />
                                        Diskon Default
                                    </span>
                                    <span className="font-semibold">{level.discountPct || 0}%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-1.5">
                                        <Users className="h-4 w-4" />
                                        Pelanggan
                                    </span>
                                    <span className="font-semibold">{level.customerCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Default Levels Suggestion */}
            {levels.length === 0 && (
                <div className="card p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Contoh Level Standar:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">🏷️ Retail</p>
                            <p className="text-gray-500">0 poin, 0% diskon</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium">🏪 Reseller</p>
                            <p className="text-gray-500">500 poin, 10% diskon</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="font-medium">📦 Agen</p>
                            <p className="text-gray-500">2000 poin, 20% diskon</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <p className="font-medium">🚛 Distributor</p>
                            <p className="text-gray-500">10000 poin, 30% diskon</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
