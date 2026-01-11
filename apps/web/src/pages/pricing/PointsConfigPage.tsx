import { useState } from 'react';
import { Save, Star, Gift, Settings } from 'lucide-react';

export default function PointsConfigPage() {
    const [config, setConfig] = useState({
        pointsPerAmount: 1000, // Rp per 1 poin
        minTransactionForPoints: 10000,
        pointsExpiry: 365, // days
        redemptionRate: 100, // 100 poin = Rp 1000
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Konfigurasi Poin</h1>
                    <p className="text-gray-500">Atur sistem poin loyalitas untuk pelanggan</p>
                </div>
                <button className="btn-primary">
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earning Points */}
                <div className="card">
                    <div className="p-5 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-amber-500" />
                            <h3 className="font-semibold text-gray-900">Perolehan Poin</h3>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="label">Poin per Rupiah</label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Setiap</span>
                                <input
                                    type="number"
                                    value={config.pointsPerAmount}
                                    onChange={(e) => setConfig({ ...config, pointsPerAmount: Number(e.target.value) })}
                                    className="input w-32"
                                />
                                <span className="text-sm text-gray-500">Rupiah = 1 poin</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Contoh: Belanja Rp 100.000 = 100 poin</p>
                        </div>
                        <div>
                            <label className="label">Minimum Transaksi</label>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Min.</span>
                                <input
                                    type="number"
                                    value={config.minTransactionForPoints}
                                    onChange={(e) => setConfig({ ...config, minTransactionForPoints: Number(e.target.value) })}
                                    className="input w-32"
                                />
                                <span className="text-sm text-gray-500">Rupiah untuk dapat poin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Redeeming Points */}
                <div className="card">
                    <div className="p-5 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-purple-500" />
                            <h3 className="font-semibold text-gray-900">Penukaran Poin</h3>
                        </div>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <label className="label">Nilai Poin</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={config.redemptionRate}
                                    onChange={(e) => setConfig({ ...config, redemptionRate: Number(e.target.value) })}
                                    className="input w-24"
                                />
                                <span className="text-sm text-gray-500">poin = Rp 1.000</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Pelanggan bisa tukar poin menjadi diskon</p>
                        </div>
                        <div>
                            <label className="label">Masa Berlaku Poin</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    value={config.pointsExpiry}
                                    onChange={(e) => setConfig({ ...config, pointsExpiry: Number(e.target.value) })}
                                    className="input w-24"
                                />
                                <span className="text-sm text-gray-500">hari sejak diperoleh</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Set 0 untuk poin tidak pernah kadaluarsa</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Level Auto Upgrade */}
            <div className="card">
                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-gray-500" />
                        <h3 className="font-semibold text-gray-900">Auto Upgrade Level</h3>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-900">Level Otomatis Naik</h4>
                            <p className="text-sm text-gray-500">Pelanggan otomatis naik level ketika poin mencukupi</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
